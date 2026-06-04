def validate_message(message: str) -> str:
    # 1. 메시지가 비어있을 때
    if not message:
        return "메시지를 입력하세요"
    
    # 2. 메시지가 500자를 초과할 때 (501자부터)
    if len(message) > 500:
        return "메시지가 너무 깁니다"
    
    # 3. 통과했을 때 (정상 메시지)
    return message

def test_validate_message():
    assert validate_message("안녕") == ""
    assert validate_message("") == "메시지를 입력하세요"
    assert validate_message("a" * 501) == "메시지가 너무 깁니다"