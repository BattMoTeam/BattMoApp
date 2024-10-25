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
        ["Home", "Simulate", "Analyze", "Materials and models"],
        icons=['house', 'battery-charging', 'graph-up', 'layers'],
        menu_icon="cast",
        default_index=0,
        # styles={
        #     "container": {"background-color": "transparent"},
        # },
    )

if page == "Home":
    pg.show_home()

elif page == "Simulate":

    bar = option_menu(
        None,
        [
            "Upload",
            "Build Model",
            "Build Geometry",
            "Fill Geometry",
            "Protocol",
            "Simulation",
        ],
        icons=[
            'box-arrow-in-down',
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

    if bar == "Upload":
        pg.show_upload()
    elif bar == "Build Model":
        pg.show_build_model()

    elif bar == "Build Geometry":
        pg.show_cell_design()
    elif bar == "Fill Geometry":
        pg.show_fill_geometry()
    elif bar == "Protocol":
        pg.show_protocol()
    elif bar == "Simulation":
        pg.show_simulation()

elif page == "Analyze":
    pg.show_results()

else:
    pg.show_materials_and_models()


if "theme" not in st.session_state:
    st.session_state.theme = False

with bottom():

    _, col1, col2 = st.columns((7, 1.5, 1))

    with col2:
        # flag_image = Image.open(
        #     os.path.join(app_access.get_path_to_images_dir(), "flag_of_europe.jpg")
        # )
        # st.image(os.path.join(app_access.get_path_to_images_dir(), "flag_of_europe.jpg"))

        def image_to_base64(image_path):
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode()

        # Path to the image
        image_path = os.path.join(app_access.get_path_to_images_dir(), "flag_of_europe.jpg")

        # Convert image to base64
        image_base64 = image_to_base64(image_path)

        # Embed the image in HTML
        st.html(
            f'<img src="data:image/jpeg;base64,{image_base64}" id="flag_of_europe" style="width: 80px;">'
        )

    with col1:
        with stylable_container(
            key="indicator_container",
            css_styles="""
                {
                    background-color: #F0F0F0;
                    color: black;
                    border-radius: 10px;
                    border: 4px solid #770737;
                    height: 25px;
                    padding: 5px; /* Padding to give some space inside */

                }
                """,
        ):

            cont = st.container(key="bottom_container")
            # cont.markdown("*Dark theme*")

            with cont:
                cola, colb = st.columns((1, 10))
                cola.text("")
                theme = colb.toggle("Dark theme", label_visibility="visible")

        st.session_state.theme = theme

    # style_container()


if theme == True:
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
elif theme == False:
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
