import streamlit as st
import os
from streamlit_navigation_bar import st_navbar
import app_pages as pg
from PIL import Image
from app_scripts import app_access
import streamlit.components.v1 as components
import pathlib
from bs4 import BeautifulSoup
import shutil


##############################
# Page Config

st.set_page_config(
    page_title="BattMo",
    page_icon=Image.open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "images", "battmo_logo.png")
    ),
    layout="wide",
)


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

# components.html(
#     """
#     <script async src="https://app.batterymodel.com/umami/script.js" data-website-id="adcac53d-bc65-4ca3-9f98-be5c7c4ee75d"></script>
#     """,
#     height=0,
# )


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

# def inject_umami():
#     umami_js = """
#         <script defer src="https://cloud.umami.is/script.js" data-website-id="adcac53d-bc65-4ca3-9f98-be5c7c4ee75d"></script>
#     """
#     st.markdown(umami_js, unsafe_allow_html=True)


# inject_umami()


##############################
# Remember user changed values
for k, v in st.session_state.items():
    st.session_state[k] = v
##############################


home_page = st.Page("app_pages/Home.py", title="Home", default=True)  # , icon="🏠")

simulation_page = st.Page("app_pages/Simulation.py", title="Simulation")  # , icon="🔋")

results_page = st.Page("app_pages/Results.py", title="Results")  # , icon="📈")

materials_models_page = st.Page(
    "app_pages/Materials_and_models.py", title="Materials and models"
)  # , icon="🍪")


streamlit_nav = st.navigation(
    pages=[home_page, simulation_page, results_page, materials_models_page]
)

streamlit_nav.run()
