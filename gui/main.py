from nicegui import app, ui
from global_styling.design_system.components import primary_button


app.add_static_files('/static', 'static')
ui.add_head_html('<link rel="stylesheet" href="/static/themes.css">')


ui.label('Hello, World!')
primary_button('Run simulator', on_click=lambda: ui.notify('Button clicked!'))

# Step data
step_titles = [
    'Simulation type',
    'Simulation configuration',
    'Cell configuration',
    'Cycling protocol',
]
steps_map = {}

# Page layout: Left fixed stepper, middle scrollable content
with ui.row().classes('w-full h-screen'):

    # Fixed left column with stepper
    with ui.column().classes('w-1/4 h-full sticky top-0 p-4'):
        with ui.stepper().props(
            'vertical header-nav animated active-color=primary inactive-color=gray'
        ).classes('w-full h-full') as stepper:

            def go_to_step(idx: int):
                ui.run_javascript(
                    f'''
                    var el = document.getElementById("{steps_map[idx]}");
                    var container = document.getElementById("scroll-container");
                    container.scrollTo({{ top: el.offsetTop - container.offsetTop, behavior: 'smooth' }});
                    '''
                )

            for idx, title in enumerate(step_titles, start=1):
                with ui.step(title).props(
                    'icon="adjust" active-icon="adjust" inactive-icon="adjust" done-icon="adjust"'
                ).on('click', lambda idx=idx: go_to_step(idx)):
                    ui.label(f'Click to view {title}')

    # Middle scrollable content area
    with ui.element('div').classes('w-200 h-full overflow-y-auto p-8').props(
        'id="scroll-container"'
    ):
        for idx, title in enumerate(step_titles, start=1):
            element_id = f'step-content-{idx}'
            with ui.card().classes('my-12 p-6').props(f'id="{element_id}"'):
                ui.label(f'{title} Content Box')
                ui.label(f'Detailed information for {title}...')
            steps_map[idx] = element_id

# # Additional CSS for bigger icons & step padding
ui.add_head_html(
    '''
<style>
    /* Remove border and background */
    .q-stepper, 
    .q-stepper__content {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
    }

    /* Enlarge the clickable step tab area */
    .q-stepper__tab {
        padding: 1rem 1.5rem !important;
    }

    /* Make the background circles bigger */
    .q-stepper__tab .q-btn {
        width: 4rem !important;
        height: 4rem !important;
        min-width: 4rem !important;
        min-height: 4rem !important;
        border-radius: 50% !important;
    }

    /* Make the icon inside the circle bigger */
    .q-stepper__tab .q-btn .q-icon {
        font-size: 2rem !important;
    }

    /* Enlarge the label text next to the circle */
    .q-stepper__title {
        font-size: 1.2rem !important;
        font-weight: bold !important;
    }
</style>
'''
)


# Toggle handler
def toggle_panel():
    drawer.toggle()
    if drawer.value:
        toggle_button.text = '→ Hide'
    else:
        toggle_button.text = '← Show'


# Right-side drawer with close button
with ui.right_drawer(value=False).classes('right') as drawer:
    with ui.column().classes('p-4'):
        ui.button('✖ Close', on_click=toggle_panel).classes('self-end mb-4 bg-red-500 text-white')
        ui.label('Results:')
        ui.label('Metric 1: 42')
        ui.label('Metric 2: 99')
        ui.label('Metric 3: 123')

# Vertical toggle button fixed to right edge
with ui.element('div').classes(
    'fixed top-0 right-0 flex flex-col items-center mt-20 cursor-pointer '
    'bg-blue-500 text-white rounded-l-lg shadow-lg p-2'
):
    toggle_button = ui.button('← Results', on_click=toggle_panel).classes(
        'transform -rotate-90 origin-bottom'
    )

with ui.page_sticky().classes('fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg'):
    ui.label('Metric: 123')
    ui.button('Action 1')
    ui.button('Action 2')


ui.run(port=8501)
