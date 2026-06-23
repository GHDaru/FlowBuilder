import json
from typing import List, Dict, Any, Optional
from domain.ports.official_db_port import IOfficialDbPort
from application.services.flow_execution import FlowExecutionUseCase
from infrastructure.database.connection import SessionLocal, Tracking, Execution
import uuid

class OfficialDataService:
    def __init__(self, port: IOfficialDbPort, execution_service: FlowExecutionUseCase):
        self.port = port
        self.execution_service = execution_service

    def get_firms(self, search: Optional[str] = None) -> List[Dict[str, Any]]:
        return self.port.list_firms(search)

    def get_interactions(self, firm_ids: List[str]) -> List[Dict[str, Any]]:
        return self.port.list_interactions(firm_ids)

    def get_available_variables(self) -> List[Dict[str, Any]]:
        """Returns static list of available global variables for injection."""
        return [
            {
                "id": "atendimento",
                "label": "Conteúdo do Atendimento",
                "description": "O texto completo da conversa/ticket"
            },
            {
                "id": "contabilidade_nome",
                "label": "Nome da Contabilidade",
                "description": "Nome da empresa contábil responsável pelo atendimento"
            },
            {
                "id": "cliente_nome",
                "label": "Nome do Cliente",
                "description": "Nome do cliente final que solicitou o atendimento"
            },
            {
                "id": "atendente_nome",
                "label": "Nome do Atendente",
                "description": "Nome do colaborador que realizou o atendimento"
            },
            {
                "id": "ticket_id",
                "label": "ID do Ticket",
                "description": "Identificador único do ticket no sistema oficial"
            },
            {
                "id": "data_atendimento",
                "label": "Data do Atendimento",
                "description": "Data e hora em que o atendimento foi iniciado"
            }
        ]

    async def trigger_processing(self, flow_id: str, interaction_ids: List[int], background_tasks: Any) -> Dict[str, Any]:
        """
        Triggers execution for multiple official interactions.
        Creates local Tracking records first.
        """
        # Resolve firm_id from the first interaction to use in folder_path
        firm_id = "UNKNOWN"
        if interaction_ids:
            first_details = self.port.get_interaction_details(interaction_ids[0])
            firm_id = first_details.get("contabilidade_id", "UNKNOWN")

        db = SessionLocal()
        try:
            # Create a main execution group
            db_execution = Execution(
                folder_path=f"OFFICIAL_DB:{firm_id}",
                status="RUNNING",
                total_files=len(interaction_ids)
            )
            db.add(db_execution)
            db.commit()
            db.refresh(db_execution)

            tracking_ids = []
            for interaction_id in interaction_ids:
                details = self.port.get_interaction_details(interaction_id)
                atendimento_id = details.get("ticket_id", str(interaction_id))
                
                # Create local tracking record
                db_tracking = Tracking(
                    atendimento_id=atendimento_id,
                    execution_id=db_execution.id,
                    status="PENDING"
                )
                db.add(db_tracking)
                db.commit()
                db.refresh(db_tracking)
                
                tracking_ids.append(db_tracking.id)
                
                # Run in background
                background_tasks.add_task(self._run_task, flow_id, interaction_id, db_tracking.id)
                
            return {
                "execution_id": db_execution.id,
                "tracking_ids": tracking_ids
            }
        finally:
            db.close()

    def _run_task(self, flow_id: str, interaction_id: int, tracking_id: str):
        """Internal helper to run the flow for a specific interaction."""
        content = self.port.get_interaction_content(interaction_id)
        details = self.port.get_interaction_details(interaction_id)
        
        # Map official details to global variables
        initial_metadata = {
            "atendimento": content, # Direct injection of main content
            "contabilidade_nome": details.get("contabilidade_nome", "N/A"),
            "ticket_id": details.get("ticket_id", "N/A"),
            "data_atendimento": details.get("created_at", "N/A")
        }
        
        print(f"[DEBUG] Extracted initial_metadata from DB: {list(initial_metadata.keys())}")
        
        # Try to extract more from avaliacao if present
        avaliacao = details.get("avaliacao")
        if avaliacao:
            try:
                av_data = json.loads(avaliacao) if isinstance(avaliacao, str) else avaliacao
                initial_metadata["cliente_nome"] = av_data.get("nome_cliente", "N/A")
                initial_metadata["atendente_nome"] = av_data.get("atendente_principal", "N/A")
                print(f"[DEBUG] Added evaluation metadata: cliente={initial_metadata.get('cliente_nome')}, atendente={initial_metadata.get('atendente_nome')}")
            except Exception as e:
                print(f"[DEBUG] Error parsing evaluation JSON: {e}")
                pass

        # Update to PROCESSING
        db = SessionLocal()
        try:
            tracking = db.query(Tracking).filter(Tracking.id == tracking_id).first()
            if tracking:
                tracking.status = "PROCESSING"
                db.commit()
            
            # Execute
            self.execution_service.execute(flow_id, content, tracking_id, initial_metadata=initial_metadata)
        except Exception as e:
            print(f"Error in background official processing: {e}")
        finally:
            db.close()
