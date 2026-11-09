# REDIFICADOR MENTORING: versión de prueba con IA propia

Contenido:
- `index.html`: la app completa.
- `api/ai.js`: función del servidor que llama a la IA con tu clave secreta.

## Publicarla gratis (Vercel, subdominio nombre.vercel.app)
1. Crea una cuenta en github.com y un repositorio nuevo. Sube `index.html` y la carpeta `api` (botón "Add file > Upload files").
2. Crea una cuenta en vercel.com con tu cuenta de GitHub. "Add New > Project", elige el repositorio y pulsa Deploy.
3. En la consola de Anthropic (console.anthropic.com) crea una clave de API, carga un saldo pequeño y fija un límite de gasto mensual.
4. En Vercel: Settings > Environment Variables. Agrega:
   - `ANTHROPIC_API_KEY` = tu clave
   - `ACCESS_CODE` = un código que tú inventes y compartes solo con los probadores
   - `MODEL` (opcional) = `claude-haiku-5-5` (económico) o `claude-sonnet-5-5` (más capaz)
5. Redeploy (Deployments > ... > Redeploy). Abre tu dirección .vercel.app, escribe el código de acceso cuando lo pida y prueba una lección.

## Medir uso y costo real
- En la app: pestaña Progreso > "Uso de IA y costo estimado" (consultas, minutos y tokens por estudiante).
- Con esta versión los tokens son los reales que informa la IA. También salen en Vercel > Logs (líneas "USO").
- Ajusta los precios por millón de tokens en esa misma tarjeta.

## Importante
- Es solo para pruebas: no hay cuentas de usuario y los datos de cada familia se guardan en su propio navegador.
- Cualquiera que tenga el código de acceso gasta tu saldo de IA. Compártelo con pocas personas y cámbialo cuando quieras.
- El plan gratuito de Vercel (Hobby) es para uso personal no comercial. Para cobrar, revisa sus términos.
- Si la primera consulta falla, revisa Vercel > Logs: ahí aparece el motivo (clave, modelo o saldo).
