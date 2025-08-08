from nicegui import ui

ui.colors(
    primary= '#901F63',
    secundary= '#3A1245'
)


def simulator_content():
    with ui.column().classes('px-40 w-full'):
        #Simulation nav bar
        with ui.tabs().props('active-color=primary').classes('border w-full') as tabs:
            ui.tab('simulation_setup', label='Simulation Setup')
            ui.tab('results', label='Results')
        
        #Section 1
        with ui.row().classes('border w-full justify-between'):
            #Select model
            with ui.column().classes('border w-2/5'):
                ui.label('Select Model')
            
            #Upload file
            with ui.column().classes('border w-2/5'):
                ui.label('Upload File')

        #Section 2
        with ui.row().classes('border w-full justify-between'):
            #Left side simulator
            with ui.column().classes('border w-3/5'):
                #Cell configuration
                with ui.column().classes('border'):
                    ui.label('Cell Configuration')
                
                #Simulation protocol
                with ui.column().classes('border'):
                    ui.label('Simulation Protocol')
            

            #Rught side simulator
            with ui.column().classes('border w-1/5'):
                #Some indicators
                with ui.column().classes('border'):
                    ui.label('Some indicators')
                
                #Run simulation
                ui.button('Run Simulation', color='primary', on_click=lambda: ui.notify('Simulation started!'))


@ui.page('')
def page_layout():
    simulator_content()
    with ui.header(elevated=True).style('background-color: primary').classes('px-40 items-center justify-between'):
        ui.label('HEADER')

    with ui.footer().style('background-color: primary').classes('px-40 items-center justify-between'):
        ui.label('FOOTER')

page_layout()

ui.run()