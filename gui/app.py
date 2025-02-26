import streamlit as st
import os
from streamlit_navigation_bar import st_navbar
from streamlit_option_menu import option_menu
import app_pages as pg
from PIL import Image
from app_scripts import app_access
import streamlit.components.v1 as components
import pathlib
from bs4 import BeautifulSoup
import shutil
from app_scripts.app_access import get_path_to_pages_dir
import json


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


def inject_ga():
    UM_ID = "adcac53d-bc65-4ca3-9f98-be5c7c4ee75d"

    UM_JS = """
        <script defer src="https://cloud.umami.is/script.js" data-website-id="adcac53d-bc65-4ca3-9f98-be5c7c4ee75d"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js, new Date());
            gtag('config', 'adcac53d-bc65-4ca3-9f98-be5c7c4ee75d');
        <script>
        """

    # Insert script into the index.html file
    index_path = pathlib.Path(st.__file__).parent / "static" / "index.html"
    soup = BeautifulSoup(index_path.read_text(), features="html.parser")
    if not soup.find(id=UM_ID):
        bck_index = index_path.with_suffix('.bck')
        if bck_index.exists():
            shutil.copy(bck_index, index_path)
        else:
            shutil.copy(index_path, bck_index)
        html = str(soup)
        new_html = html.replace('<head>', '<head>\n' + UM_JS)
        index_path.write_text(new_html)


inject_ga()


####################
# Page navigation
####################

with open(os.path.join(get_path_to_pages_dir(), "page_structure.json"), 'r') as f:
    json_data = json.load(f)

pages_data = json_data["pages"]


# Helper function to execute a function by name
def execute_function(function_name):
    if hasattr(pg, function_name):
        getattr(pg, function_name)()


# Main navigation
with st.sidebar:
    main_pages = []
    main_icons = []
    sub_menus = {}

    for key, page in pages_data.items():
        main_pages.append(page["display_name"])
        main_icons.append(page.get("bootstrap_icon", ""))
        if "sub_pages" in page:
            sub_menus[page["display_name"]] = page["sub_pages"]

    selected_page = option_menu(
        None,
        main_pages,
        icons=main_icons,
        menu_icon="cast",
        default_index=0,
    )

# Show the corresponding page
for key, page in pages_data.items():
    if selected_page == page["display_name"]:
        if "execute" in page:
            execute_function(page["execute"])
        if "sub_pages" in page:
            # Submenu navigation
            sub_page_data = sub_menus[page["display_name"]]
            sub_page_names = [sp["display_name"] for sp in sub_page_data.values()]
            sub_page_icons = [sp["bootstrap_icon"] for sp in sub_page_data.values()]
            sub_page_functions = [sp["execute"] for sp in sub_page_data.values()]

            sub_selected = option_menu(
                None,
                sub_page_names,
                menu_icon="cast",
                icons=sub_page_icons,
                default_index=0,
                orientation="horizontal",
            )

            for sp_key, sp in sub_page_data.items():
                if sub_selected == sp["display_name"]:
                    execute_function(sp["execute"])


# home_page = st.Page("pages/Home.py", title="Home", default=True)  # , icon="🏠")

# simulation_page = st.Page("pages/Simulation.py", title="Simulation")  # , icon="🔋")

# results_page = st.Page("pages/Analyze.py", title="Analyze")  # , icon="📈")

# materials_models_page = st.Page("pages/Library.py", title="Library")  # , icon="🍪")

# Create a custom horizontal navigation bar
# Custom CSS for horizontal navigation bar

# streamlit_nav = st.navigation(
#     pages=[home_page, simulation_page, results_page, materials_models_page]
# )


# streamlit_nav.run()
