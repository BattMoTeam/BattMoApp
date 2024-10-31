import streamlit as st
import sys
import os
from streamlit_extras.stylable_container import stylable_container

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


def show_cell_design():

    gui_parameters = st.session_state.json_linked_data_input
    app = get_app_controller()

    with stylable_container(
        key="green_button",
        css_styles="""
            {
                background-color: #FFFFFF;
                color: white;
                # border-radius: 20px;
            }
            """,
    ):

        cont1 = st.container()

    _, col1, _ = cont1.columns((0.5, 1.5, 0.5))

    with col1:
        geom1, geom2 = st.tabs(("Cell design", "Geometry used for the simulation"))
        st.text("")
        with geom1:
            app.set_geometry_visualization(gui_parameters)

        st.text("")

    col1, col2 = st.columns((1, 3))

    with col1:
        st.text("")
        st.markdown("#### " + "Select cell type:")

        # st.text("")
        st.markdown("#### " + "Use a common cell design:")

    with col2:
        st.selectbox("", ("Pouch", "Cylindrical"))
        common_design = st.toggle("", key="common design", label_visibility="hidden")
        if common_design:
            st.selectbox("", ("cell_example1", "cell_example2"))

    col3, col4 = st.columns((1, 4))

    with col3:
        st.text("")
        st.text("")
        st.write("Cell length")
        st.text("")
        st.text("")
        st.write("Cell width")

    with col4:
        st.number_input("", value=100, key="1")
        st.number_input("", value=100, key="2")

    st.text("")
    st.text("")

    col, cola, colb, colc, cold, cole = st.columns(6)

    with col:
        st.text("")
        st.text("")
        st.text("")
        st.text("")
        st.text("")
        st.write("Thicknesses:")
        st.text("")
        st.text("")

        st.write("Number of discrete cells:")

    with cola:
        st.write("Current Collector (NE)")
        st.number_input("", value=10, key="3")
        st.number_input("", value=10, key="33")

    with colb:
        st.write("Negative Electrode")
        st.number_input("", value=10, key="4")
        st.number_input("", value=10, key="44")

    with colc:
        st.write("Separator")
        st.number_input("", value=10, key="5")
        st.number_input("", value=10, key="55")

    with cold:
        st.write("Positive Electrode")
        st.number_input("", value=10, key="6")
        st.number_input("", value=10, key="66")

    with cole:
        st.write("Current Collector (PE)")
        st.number_input("", value=10, key="7")
        st.number_input("", value=10, key="77")

    app.set_footer(page=None)
