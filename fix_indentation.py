#!/usr/bin/env python3
"""
Script para corrigir erros de indentação no app.py
Execute este script no mesmo diretório do app.py
"""

import sys
import os

def fix_app_py():
    # Verifica se app.py existe
    if not os.path.exists('app.py'):
        print("❌ Arquivo app.py não encontrado no diretório atual!")
        print(f"   Diretório atual: {os.getcwd()}")
        sys.exit(1)
    
    print("📂 Lendo app.py...")
    
    # Lê o arquivo
    with open('app.py', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"✓ Arquivo lido: {len(lines)} linhas")
    
    # Mapeia as linhas que precisam de correção
    corrections = {
        619: 8,   # if submit:
        620: 12,  # if name:
        621: 16,  # login = ...
        622: 16,  # # Para Secretária...
        623: 16,  # # Como o ID...
        624: 16,  # if insert_staff...
        625: 20,  # # Re-fetch...
        626: 20,  # st.session_state...
        627: 20,  # (linha vazia)
        628: 20,  # # Encontrar...
        629: 20,  # new_sec = ...
        630: 20,  # if new_sec...
        631: 24,  # # ATENÇÃO...
        632: 24,  # # Para simplificar...
        633: 24,  # # e o escopo...
        634: 24,  # # Em um sistema...
        635: 24,  # st.success...
        636: 20,  # else:
        637: 24,  # st.success...
        638: 16,  # else:
        639: 20,  # st.error...
        653: 8,   # if submit:
        654: 12,  # if name:
        655: 16,  # # Find key...
        656: 16,  # perm_key = ...
        657: 16,  # st.session_state...
        658: 16,  # st.success...
    }
    
    print("🔧 Corrigindo indentação...")
    
    # Processa linha por linha
    output = []
    tabs_found = 0
    
    for i, line in enumerate(lines, 1):
        # Conta tabs
        if '\t' in line:
            tabs_found += 1
        
        if i in corrections:
            # Remove tabs e espaços, depois adiciona a indentação correta
            clean_line = line.replace('\t', '').lstrip()
            if clean_line.strip():  # se não é linha vazia
                output.append(' ' * corrections[i] + clean_line)
            else:
                output.append('\n')
        else:
            # Remove tabs mas mantém espaços
            output.append(line.replace('\t', ''))
    
    print(f"✓ {tabs_found} tabs encontrados e removidos")
    print(f"✓ {len(corrections)} linhas corrigidas")
    
    # Faz backup
    print("💾 Criando backup...")
    with open('app.py.backup', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("✓ Backup salvo como app.py.backup")
    
    # Salva arquivo corrigido
    print("💾 Salvando app.py corrigido...")
    with open('app.py', 'w', encoding='utf-8') as f:
        f.writelines(output)
    
    print("✓ Arquivo salvo!")
    
    # Verifica sintaxe
    print("🔍 Verificando sintaxe Python...")
    import py_compile
    try:
        py_compile.compile('app.py', doraise=True)
        print("✅ SUCESSO! Arquivo app.py corrigido e validado!")
        print("\n🚀 Agora você pode fazer:")
        print("   git add app.py")
        print("   git commit -m 'Fix: Corrigir indentação'")
        print("   git push")
        return 0
    except SyntaxError as e:
        print(f"❌ Ainda há erro de sintaxe na linha {e.lineno}:")
        print(f"   {e.msg}")
        print("\n⚠️  O backup está salvo em app.py.backup")
        return 1

if __name__ == '__main__':
    sys.exit(fix_app_py())
