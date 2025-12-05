#!/bin/bash
# Execute este comando no terminal do Streamlit Cloud
# Copia e cola tudo de uma vez

cd /mount/src/sistema-gestao-mudancas-streamlit || exit 1

echo "🔧 Corrigindo app.py..."

# Cria backup
cp app.py app.py.backup

# Corrige o arquivo usando Python
python3 << 'PYTHON_SCRIPT'
with open('app.py', 'rb') as f:
    content = f.read()

text = content.decode('utf-8')
text_no_tabs = text.replace('\t', '')
lines = text_no_tabs.split('\n')

# Corrige linhas 619-639 (índices 618-638)
lines[618] = '        if submit:'
lines[619] = '            if name:'
lines[620] = '                login = name.lower().replace(" ", "") + "@telemim.com"'
lines[621] = '                # Para Secretária, o secretaryId é o próprio ID (auto-referência)'
lines[622] = '                # Como o ID é gerado pelo DB, vamos inserir sem o ID e depois atualizar o session state'
lines[623] = "                if insert_staff(name, login, '123', 'SECRETARY', 'Secretária', None, name):"
lines[624] = '                    # Re-fetch para obter o ID gerado e atualizar o session state'
lines[625] = '                    st.session_state.data = fetch_all_data()'
lines[626] = '                    '
lines[627] = '                    # Encontrar o ID da secretária recém-criada para atualizar o secretaryId (self-reference)'
lines[628] = "                    new_sec = next((s for s in st.session_state.data['staff'] if s['email'] == login), None)"
lines[629] = "                    if new_sec and new_sec.get('secretaryId') is None:"
lines[630] = '                        # ATENÇÃO: A função insert_staff não permite UPDATE. '
lines[631] = '                        # Para simplificar, vamos aceitar que o secretaryId da Secretária seja NULL por enquanto,'
lines[632] = "                        # e o escopo será tratado pelo \`filter_by_scope\` que verifica \`item.get('id') == str(scope)\`."
lines[633] = '                        # Em um sistema real, seria necessário um UPDATE SQL para self-reference.'
lines[634] = '                        st.success(f"Criado! Login automático: {login} / Senha: 123. (Lembre-se de configurar o secretaryId no DB se necessário para escopo)")'
lines[635] = '                    else:'
lines[636] = '                        st.success(f"Criado! Login automático: {login} / Senha: 123.")'
lines[637] = '                else:'
lines[638] = '                    st.error("Erro ao cadastrar Secretária no banco de dados.")'

# Corrige linhas 653-658 (índices 652-657)
lines[652] = '        if submit:'
lines[653] = '            if name:'
lines[654] = '                # Find key by value'
lines[655] = '                perm_key = next(key for key, value in ROLES.items() if value == perm)'
lines[656] = "                st.session_state.data['roles'].append({'id': int(time.time()), 'name': name, 'permission': perm_key})"
lines[657] = '                st.success("Cargo criado.")'

final_text = '\n'.join(lines)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("✅ Arquivo corrigido!")
PYTHON_SCRIPT

echo "✅ Backup salvo em app.py.backup"
echo "✅ app.py corrigido!"
echo ""
echo "🚀 Agora execute:"
echo "   git add app.py"
echo "   git commit -m 'Fix: Remover tabs e corrigir indentação'"
echo "   git push"
