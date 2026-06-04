import json

log_file = r"C:\Users\krish\.gemini\antigravity\brain\66b3d7dd-b40f-401f-8ab5-084c6fd13024\.system_generated\logs\transcript.jsonl"

def recover():
    lines = []
    with open(log_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    files = {
        'c:\\Users\\krish\\app\\JOSAA AND CSAB\\index.html': "",
        'c:\\Users\\krish\\app\\JOSAA AND CSAB\\styles.css': "",
        'c:\\Users\\krish\\app\\JOSAA AND CSAB\\app.js': ""
    }
    
    for line in lines:
        try:
            step = json.loads(line)
            if step.get('type') == 'USER_INPUT' and 'give this type of design to homepage' in step.get('content', ''):
                break
                
            if 'tool_calls' in step:
                for call in step['tool_calls']:
                    args = call.get('args', {})
                    if not args: continue
                    
                    target = args.get('TargetFile', '')
                    if not target: continue
                    target = target.strip('"').replace('/', '\\').lower()
                    
                    matched_file = None
                    for k in files.keys():
                        if target.endswith(k.split('\\')[-1]):
                            matched_file = k
                            break
                            
                    if matched_file:
                        if call['name'] == 'write_to_file':
                            content = args.get('CodeContent', '')
                            if content.startswith('"') and content.endswith('"'):
                                try: content = json.loads(content)
                                except: pass
                            files[matched_file] = content
                            
                        elif call['name'] == 'replace_file_content':
                            target_content = args.get('TargetContent', '')
                            replacement = args.get('ReplacementContent', '')
                            if target_content.startswith('"') and target_content.endswith('"'):
                                try: target_content = json.loads(target_content)
                                except: pass
                            if replacement.startswith('"') and replacement.endswith('"'):
                                try: replacement = json.loads(replacement)
                                except: pass
                            
                            files[matched_file] = files[matched_file].replace(target_content, replacement)
                            
                        elif call['name'] == 'multi_replace_file_content':
                            chunks = args.get('ReplacementChunks', [])
                            if isinstance(chunks, str):
                                try: chunks = json.loads(chunks)
                                except: chunks = []
                            for chunk in chunks:
                                t = chunk.get('TargetContent', '')
                                r = chunk.get('ReplacementContent', '')
                                if t.startswith('"') and t.endswith('"'):
                                    try: t = json.loads(t)
                                    except: pass
                                if r.startswith('"') and r.endswith('"'):
                                    try: r = json.loads(r)
                                    except: pass
                                files[matched_file] = files[matched_file].replace(t, r)
        except Exception as e:
            pass

    for path, content in files.items():
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Recovered {path}")

recover()
