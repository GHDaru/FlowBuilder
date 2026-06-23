from abc import ABC, abstractmethod
from typing import List, Optional
from domain.models.flow import Flow

class IFlowRepository(ABC):
    @abstractmethod
    def save(self, flow: Flow) -> Flow:
        pass

    @abstractmethod
    def get_by_id(self, flow_id: str) -> Optional[Flow]:
        pass

    @abstractmethod
    def list_all(self) -> List[Flow]:
        pass

    @abstractmethod
    def delete(self, flow_id: str) -> bool:
        pass
