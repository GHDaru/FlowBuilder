from sqlalchemy import Column, String, BigInteger, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from infrastructure.database.postgres_connection import OfficialBase

class OfficialContabilidade(OfficialBase):
    __tablename__ = 'contabilidades'
    
    id = Column(BigInteger, primary_key=True)
    external_id = Column(String, unique=True)
    nome = Column(String, name='razao_social')
    
    atendimentos = relationship(
        "OfficialAtendimento", 
        primaryjoin="OfficialContabilidade.external_id == OfficialAtendimento.contabilidade_id",
        foreign_keys="OfficialAtendimento.contabilidade_id",
        back_populates="contabilidade"
    )

class OfficialAtendimento(OfficialBase):
    __tablename__ = 'atendimentos'
    
    id = Column(BigInteger, primary_key=True)
    contabilidade_id = Column(String) # This stores external_id
    ticket_id = Column(String)
    avaliacao_json = Column(Text)
    created_at = Column(DateTime)
    
    # Score fields
    nota_media = Column(Float)
    nota_comunicacao = Column(Float)
    nota_profissionalismo = Column(Float)
    nota_resolucao = Column(Float)
    
    contabilidade = relationship(
        "OfficialContabilidade", 
        primaryjoin="OfficialAtendimento.contabilidade_id == OfficialContabilidade.external_id",
        foreign_keys="OfficialAtendimento.contabilidade_id",
        back_populates="atendimentos"
    )
    chat = relationship("OfficialAtendimentoChat", back_populates="atendimento", uselist=False)

class OfficialAtendimentoChat(OfficialBase):
    __tablename__ = 'atendimento_chat'
    
    id = Column(BigInteger, primary_key=True)
    atendimento_id = Column(BigInteger, ForeignKey('atendimentos.id'))
    text_content = Column(Text)
    
    atendimento = relationship("OfficialAtendimento", back_populates="chat")
