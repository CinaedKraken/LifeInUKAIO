import json
import re

def parse_questions(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    current_q = None
    state = 'question'
    
    lines = content.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        is_option = re.match(r'^(o|⁰|no)\s+', line)
        
        if is_option:
            if current_q is None:
                continue
            state = 'options'
            text = re.sub(r'^(o|⁰|no)\s+', '', line)
            is_correct = text.endswith('.x')
            if is_correct:
                text = text[:-2]
            current_q['options'].append({
                'text': text.strip(),
                'isCorrect': is_correct
            })
        else:
            if state == 'options':
                # Transition from options to a new question
                questions.append(current_q)
                current_q = {
                    'question': line,
                    'options': []
                }
                state = 'question'
            else:
                # Still in question state
                if current_q is None:
                    current_q = {
                        'question': line,
                        'options': []
                    }
                    state = 'question'
                else:
                    current_q['question'] += ' ' + line
                    
    if current_q:
        questions.append(current_q)
        
    return questions

questions = parse_questions('C:\\App\\LifeInUK\\Sources\\free_life_in_the_UK_practice_Test_100_questions.txt')

with open('C:\\App\\LifeInUK\\Sources\\parsed_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Parsed {len(questions)} questions.")
