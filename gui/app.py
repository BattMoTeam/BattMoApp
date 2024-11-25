import streamlit as st
import os
from streamlit_option_menu import option_menu
from streamlit_extras.stylable_container import stylable_container
from streamlit_extras.bottom_container import bottom
from streamlit_extras.colored_header import colored_header
import app_pages as pg
from PIL import Image
from app_scripts import app_access
import base64
from app_scripts.app_session_states import init_session_states

# from streamlit_extras.container import style_container


##############################
# Page Config

st.set_page_config(
    page_title="BattMo",
    page_icon=Image.open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "images", "battmo_logo.png")
    ),
    layout="wide",
)

##############################
# Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v
##############################

st.logo(
    image=os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "images", "battmo_logo_text.png"
    ),
    link="https://batterymodel.com/",
    icon_image=os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "images", "battmo_logo.png"
    ),
    size="large",
)


st.markdown(
    """
    <style>
    [data-testid="stSidebar"] img {
        width: 200px !important;  /* Adjust this value to your desired width */
        height: auto;  /* Maintain the aspect ratio */
        margin: 0 auto;  /* Center the logo */
        display: block;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


# home_page = st.Page("app_pages/Home.py", title="Home", default=True)  # , icon="🏠")

# simulation_page = st.Page("app_pages/Simulation.py", title="Simulation")  # , icon="🔋")

# results_page = st.Page("app_pages/Results.py", title="Results")  # , icon="📈")

# materials_models_page = st.Page(
#     "app_pages/Materials_and_models.py", title="Materials and models"
# )  # , icon="🍪")


# streamlit_nav = st.navigation(
#     pages=[home_page, simulation_page, results_page, materials_models_page]
# )

# streamlit_nav.run()
with st.sidebar:
    page = option_menu(
        None,
        [
            "Home",
            "Parameter Sets",
            "Build Cell",
            "Simulate",
            "Analyze",
        ],  # , "Materials and models"],
        icons=['house', 'card-list', 'battery', 'battery-charging', 'graph-up'],  # , 'layers'],
        menu_icon="cast",
        default_index=0,
        # styles={
        #     "container": {"background-color": "transparent"},
        # },
    )

if page == "Home":
    pg.show_home()
elif page == "Build Cell":

    bar = option_menu(
        None,
        [
            "Negative Electrode",
            "Positive Electrode",
            "Electrolyte",
            "Separator",
            "Cell Design",
        ],
        icons=[
            'dash',
            'plus',
            '',
            'distribute-horizontal',
            'battery',
        ],
        menu_icon="cast",
        default_index=0,
        orientation="horizontal",
    )

    if bar == "Negative Electrode":
        pg.show_fill_geometry()
    elif bar == "Positive Electrode":
        pg.show_fill_geometry()
    elif bar == "Electrolyte":
        pg.show_fill_geometry()
    elif bar == "Separator":
        pg.show_fill_geometry()

    elif bar == "Cell Design":
        pg.show_cell_design()


elif page == "Simulate":

    bar = option_menu(
        None,
        [
            # "Upload",
            "Model Setup",
            "Boundary Conditions",
            "Protocol",
            "Run",
        ],
        icons=[
            'toggles',
            'battery',
            'battery-full',
            'recycle',
            'battery-charging',
        ],
        menu_icon="cast",
        default_index=0,
        orientation="horizontal",
    )

    if bar == "Model Setup":
        pg.show_build_model()
    elif bar == "Boundary Conditions":
        pg.show_fill_geometry()
    elif bar == "Protocol":
        pg.show_protocol()
    elif bar == "Run":
        pg.show_simulation()

elif page == "Analyze":
    pg.show_results()

else:
    pg.show_materials_and_models()


#################################
# Initiate all session states
#################################

init_session_states()


if st.session_state.theme == True:
    st.markdown(
        """
    <style>
    body {
        background-color: #ED820E;
        color: white;
    }
    </style>
    """,
        unsafe_allow_html=True,
    )
elif st.session_state.theme == False:
    st.markdown(
        """
    <style>
    body {
        background-color: #ffffff;
        color: black;
    }
    </style>
    """,
        unsafe_allow_html=True,
    )
