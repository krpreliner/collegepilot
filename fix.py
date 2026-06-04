import ast

for file in ['index.html', 'styles.css', 'app.js']:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # The content might be a python string literal because of how the python script wrote it?
        # Actually it's JSON encoded, so we can just use json.loads. 
        # Let's clean up quotes.
        content = content.strip()
        if content.startswith('"'):
            import json
            parsed = json.loads(content)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(parsed)
            print(f"Fixed {file}")
    except Exception as e:
        print(f"Failed {file}: {e}")
