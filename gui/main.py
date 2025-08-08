from nicegui import app, ui
from global_styling.design_system.components import primary_button


app.add_static_files('/static', 'static')
ui.add_head_html('<link rel="stylesheet" href="/static/themes.css">')


ui.label('Hello, World!')
primary_button('Run simulator', on_click=lambda: ui.notify('Button clicked!'))

with ui.stepper().props('vertical header-nav animated active-color=primary inactive-color=gray').classes('w-full') as stepper:
    with ui.step('Simulation type').props('icon="adjust" active-icon="adjust" inactive-icon="adjust" done-icon="adjust"'):
        ui.label('Content for Step 1') 
    with ui.step('Simulation configuration'):
        ui.label('Content for Step 2')
    with ui.step('Cell configuration'):
        ui.label('Content for Step 3')
    with ui.step('Cycling protocol'):
        ui.label('Content for Step 4')




ui.run(port=8501)