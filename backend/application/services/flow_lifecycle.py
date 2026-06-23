from typing import List, Optional
from domain.models.flow import Flow
from domain.ports.flow_repository import IFlowRepository

class FlowLifecycleUseCase:
    def __init__(self, repository: IFlowRepository):
        self.repo = repository

    def create_new(self, name: str, description: Optional[str] = None, json_definition: str = "{}") -> Flow:
        flow = Flow(name=name, description=description, json_definition=json_definition)
        return self.repo.save(flow)

    def save_existing(self, flow_id: str, json_definition: str, name: Optional[str] = None) -> Optional[Flow]:
        flow = self.repo.get_by_id(flow_id)
        if flow:
            flow.json_definition = json_definition
            if name:
                flow.name = name
            return self.repo.save(flow)
        return None

    def copy_flow(self, flow_id: str, new_name: str) -> Optional[Flow]:
        original = self.repo.get_by_id(flow_id)
        if original:
            # Deep copy with new identity
            new_flow = Flow(
                name=new_name,
                description=original.description,
                json_definition=original.json_definition
            )
            return self.repo.save(new_flow)
        return None

    def list_flows(self) -> List[Flow]:
        return self.repo.list_all()

    def get_flow(self, flow_id: str) -> Optional[Flow]:
        return self.repo.get_by_id(flow_id)

    def delete_flow(self, flow_id: str) -> bool:
        return self.repo.delete(flow_id)
