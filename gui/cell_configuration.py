from nicegui import ui
from nicegui import app

app.add_static_files('/icons', 'icons')

ui.add_head_html('''
    <style type="text/tailwindcss">
        h1 {
            color: #3A1245;
            font-size: 2em;
            font-weight: 500;
        }
                 
        h2 {
            color: #3A1245;
            font-size: 1.5em;
            font-weight: 500;
        }
                 
        h3 {
            color: #3A1245;
            font-size: 1.35em;
            font-weight: 500;
        }

        .custom-tabs-level-2 .q-tab__indicator {
            display: none !important;
        }
                     
        .custom-tabs-level-2 .q-tab {
            @apply text-[#939393] bg-white px-4 py-2 border border-b-0 border-white;
        }
                 
        .custom-tabs-level-2 .q-tab--active {
            @apply rounded-t-2xl text-[#901F63] bg-white px-4 py-2 border border-b-0 border-neutral-200;    
        }
                 
        .custom-tabs-level-3 .q-tab {
            @apply text-[#939393];
        }
        
                 



        .tab-with-icon .q-tab__label {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }
        .tab-with-icon .q-tab__label::before {
            content: '';
            display: inline-block;
            width: 1.1rem;
            height: 1.1rem;
            background-size: auto;
            background-repeat: no-repeat;
            filter: grayscale(50%) brightness(0.1);
            opacity: 0.5; /* make icon gray */
        }
                 
        .tab-with-icon.q-tab--active .q-tab__label::before {
            filter: none; /* restore color for active */
            opacity: 1; /* restore opacity for active */
        }
                 
        .electrodes_icon .q-tab__label::before {
            background-image: url("/icons/electrodes_icon.svg");
        }
                 
        .electrolyte_icon .q-tab__label::before {
            background-image: url("/icons/electrolyte_icon.svg");
        }
                 
        .separator_icon .q-tab__label::before {
            background-image: url("/icons/separator_icon.svg");
        }
                 
        .cell_icon .q-tab__label::before {
            background-image: url("/icons/cell_icon.svg");
        }
                 
        .negative_electrode_icon .q-tab__label::before {
            background-image: url("/icons/negative_electrode_icon.svg");
        }

        .positive_electrode_icon .q-tab__label::before {
            background-image: url("/icons/positive_electrode_icon.svg");
        }       
                 
                 
        
                 
                
    </style>
''')


ui.colors(
    primary= '#901F63',
    secundary= '#3A1245'
)

# Content electrode
def electrodes_tab_content():
    with ui.column():
        ui.html('<h2>Electrodes </h2>')

        with ui.column():
            with ui.tabs().props('active-color=secundary').classes('custom-tabs-level-3') as tabs:
                ui.tab('negative', label='Negative').classes('tab-with-icon negative_electrode_icon')
                ui.tab('positive', label='Positive').classes('tab-with-icon positive_electrode_icon')
            with ui.tab_panels(tabs, value='negative') as tab_panels:
                with ui.tab_panel('negative'):
                    ui.html('<h3>Component</h3>')
                    ui.html('<p>Negative electrode content goes here.</p>')
                with ui.tab_panel('positive'):
                    ui.html('<h3>Component</h3>')
                    ui.html('<p>Positive electrode content goes here.</p>')
                
            
            

        ui.html('<h3>Electrode Properties</h3>')
    

# Content electrolyte
def electrolyte_tab_content():
    ui.html('<h2>Electrolyte </h2>')

# Content separator
def separator_tab_content():
    ui.html('<h2>Separator </h2>')

# Content cell
def cell_tab_content():
    ui.html('<h2>Cell </h2>')




# Main UI layout
ui.html('<h1>Cell Configuration</h1>')

with ui.column().classes('border w-1/2') as simulation_element:
    with ui.tabs().props('active-color=primary').classes('custom-tabs-level-2') as tabs:
        ui.tab('electrodes', label='Electrodes').classes('tab-with-icon electrodes_icon')
        ui.tab('electrolyte', label='Electrolyte').classes('tab-with-icon electrolyte_icon')
        ui.tab('separator', label='Separator').classes('tab-with-icon separator_icon')
        ui.tab('cell', label='Cell').classes('tab-with-icon cell_icon')
    with ui.tab_panels(tabs, value='electrodes') as tab_panels:
        with ui.tab_panel('electrodes'):
            electrodes_tab_content()
        with ui.tab_panel('electrolyte'):
            electrolyte_tab_content()
        with ui.tab_panel('separator'):
            separator_tab_content()
        with ui.tab_panel('cell'):
            cell_tab_content()
    
    


