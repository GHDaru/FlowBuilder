from typing import List, Dict, Any, Optional
from sqlalchemy import func
from domain.ports.official_db_port import IOfficialDbPort
from infrastructure.database.postgres_connection import SessionLocalOfficial
from infrastructure.database.postgres_models import OfficialContabilidade, OfficialAtendimento, OfficialAtendimentoChat

class PostgresAdapter(IOfficialDbPort):
    def list_firms(self, search: Optional[str] = None) -> List[Dict[str, Any]]:
        db = SessionLocalOfficial()
        try:
            # Base query
            query = db.query(
                OfficialContabilidade.external_id,
                OfficialContabilidade.nome,
                func.count(OfficialAtendimento.id).label('count')
            ).outerjoin(
                OfficialAtendimento, 
                (OfficialContabilidade.external_id == OfficialAtendimento.contabilidade_id) & 
                (OfficialAtendimento.avaliacao_json.isnot(None))
            )
            
            # Apply search filter if provided
            if search:
                query = query.filter(OfficialContabilidade.nome.ilike(f"%{search}%"))
                
            results = query.group_by(OfficialContabilidade.external_id, OfficialContabilidade.nome).limit(500).all()
            
            return [
                {"id": r.external_id, "name": r.nome, "evaluation_count": r.count}
                for r in results
            ]
        finally:
            db.close()

    def list_interactions(self, firm_ids: List[str]) -> List[Dict[str, Any]]:
        db = SessionLocalOfficial()
        try:
            results = db.query(OfficialAtendimento).filter(
                OfficialAtendimento.contabilidade_id.in_(firm_ids)
            ).order_by(OfficialAtendimento.created_at.desc()).limit(200).all()
            
            return [
                {
                    "id": r.id, 
                    "ticket_id": r.ticket_id, 
                    "has_evaluation": r.avaliacao_json is not None,
                    "created_at": r.created_at,
                    "nota_media": r.nota_media,
                    "nota_comunicacao": r.nota_comunicacao,
                    "nota_profissionalismo": r.nota_profissionalismo,
                    "nota_resolucao": r.nota_resolucao
                }
                for r in results
            ]
        finally:
            db.close()

    def get_interaction_content(self, interaction_id: int) -> str:
        db = SessionLocalOfficial()
        try:
            chat = db.query(OfficialAtendimentoChat).filter(
                OfficialAtendimentoChat.atendimento_id == interaction_id
            ).first()
            return chat.text_content if chat else ""
        finally:
            db.close()
            
    def get_interaction_details(self, interaction_id: int) -> Dict[str, Any]:
        db = SessionLocalOfficial()
        try:
            atendimento = db.query(OfficialAtendimento).filter(
                OfficialAtendimento.id == interaction_id
            ).first()
            if not atendimento:
                return {}
            
            contabilidade = db.query(OfficialContabilidade).filter(
                OfficialContabilidade.external_id == atendimento.contabilidade_id
            ).first()

            return {
                "id": atendimento.id,
                "ticket_id": atendimento.ticket_id,
                "contabilidade_id": atendimento.contabilidade_id,
                "contabilidade_nome": contabilidade.nome if contabilidade else "N/A",
                "created_at": atendimento.created_at.isoformat() if atendimento.created_at else None,
                "avaliacao": atendimento.avaliacao_json # Might contain more info
            }
        finally:
            db.close()
