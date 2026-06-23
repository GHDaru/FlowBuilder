import pytest
from pathlib import Path
from services.file_service import FileService

def test_list_files_empty_dir(tmp_path):
    files = FileService.list_files(tmp_path)
    assert files == []

def test_list_files_with_content(tmp_path):
    (tmp_path / "test1.txt").write_text("hello")
    (tmp_path / "test2.pdf").write_text("fake pdf")
    (tmp_path / "image.png").write_text("not supported")
    
    files = FileService.list_files(tmp_path)
    assert len(files) == 3
    
    # Check if is_supported is correct
    supported = [f for f in files if f["is_supported"]]
    unsupported = [f for f in files if not f["is_supported"]]
    
    assert len(supported) == 2
    assert len(unsupported) == 1
    assert any(f["name"] == "image.png" for f in unsupported)

def test_read_text_file(tmp_path):
    p = tmp_path / "test.txt"
    p.write_text("Hello World", encoding='utf-8')
    content = FileService.read_file(p)
    assert content == "Hello World"

def test_read_non_existent_file():
    with pytest.raises(FileNotFoundError):
        FileService.read_file("non_existent_file.txt")

def test_read_unsupported_extension(tmp_path):
    p = tmp_path / "test.png"
    p.write_text("fake image")
    with pytest.raises(ValueError, match="Unsupported file extension"):
        FileService.read_file(p)

def test_read_pdf_mock(tmp_path, monkeypatch):
    p = tmp_path / "test.pdf"
    p.write_text("fake pdf")
    
    class MockPage:
        def extract_text(self):
            return "Extracted PDF Text"
            
    class MockReader:
        def __init__(self, path):
            self.pages = [MockPage()]
            
    monkeypatch.setattr("services.file_service.PdfReader", MockReader)
    
    content = FileService.read_file(p)
    assert content == "Extracted PDF Text"
