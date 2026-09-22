import json
import re
import os
import hashlib

def get_hash(text):
    return hashlib.md5(text.lower().replace(' ', '').encode('utf-8')).hexdigest()

def parse_file1(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    questions = []
    current_q = None
    state = 'question'
    
    for line in content.strip().split('\n'):
        line = line.strip()
        if not line: continue
        is_option = re.match(r'^(o|⁰|no)\s+', line)
        if is_option:
            if current_q is None: continue
            state = 'options'
            text = re.sub(r'^(o|⁰|no)\s+', '', line)
            is_correct = text.endswith('.x')
            if is_correct: text = text[:-2]
            current_q['options'].append({'text': text.strip(), 'isCorrect': is_correct})
        else:
            if state == 'options':
                questions.append(current_q)
                current_q = {'question': line, 'options': []}
                state = 'question'
            else:
                if current_q is None:
                    current_q = {'question': line, 'options': []}
                else:
                    current_q['question'] += ' ' + line
    if current_q: questions.append(current_q)
    return questions

def parse_file2(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    questions = []
    blocks = content.strip().split('\n\n')
    
    for block in blocks:
        lines = block.split('\n')
        q_lines = []
        options = []
        for line in lines:
            if not line.strip(): continue
            # If line starts with "x  " or "x True" or "x False"
            if line.startswith('x ') or line.startswith('x\t'):
                options.append({'text': line[2:].strip(), 'isCorrect': True})
            elif line.startswith('  ') or line.startswith('\t'):
                options.append({'text': line.strip(), 'isCorrect': False})
            elif line.strip() in ['True', 'False']:
                options.append({'text': line.strip(), 'isCorrect': False})
            else:
                # If we already started collecting options, maybe it's a malformed option
                if len(options) > 0:
                    options.append({'text': line.strip(), 'isCorrect': False})
                else:
                    q_lines.append(line.strip())
        
        if q_lines and options:
            questions.append({
                'question': ' '.join(q_lines),
                'options': options
            })
    return questions

def main():
    q1 = parse_file1('C:\\App\\LifeInUK\\Sources\\free_life_in_the_UK_practice_Test_100_questions.txt')
    q2 = parse_file2('C:\\App\\LifeInUK\\Sources\\life_in_the_uk_questions.txt')
    
    all_questions = q1 + q2
    print(f"Extracted {len(q1)} from file 1")
    print(f"Extracted {len(q2)} from file 2")
    
    # Deduplicate
    unique_questions = []
    seen_hashes = set()
    
    for q in all_questions:
        # Generate hash from question text
        h = get_hash(q['question'])
        if h not in seen_hashes:
            seen_hashes.add(h)
            unique_questions.append(q)
            
    print(f"Total unique questions: {len(unique_questions)}")
    
    with open('C:\\App\\LifeInUK\\Sources\\master_list.json', 'w', encoding='utf-8') as f:
        json.dump(unique_questions, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
