import streamlit as st
import sys
import os
from streamlit_extras.stylable_container import stylable_container
from streamlit_extras.bottom_container import bottom

# set config before import to avoid streamlit error
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app_scripts.app_controller import get_app_controller, log_memory_usage, set_acknowlegent_info
from app_scripts import app_view, app_access


def show_build_model():

    if "selected_model" not in st.session_state:
        st.session_state.selected_model = None

    app = get_app_controller()
    model_id = app.set_model_choice().selected_model
    st.session_state.selected_model = model_id

    col1, col2 = st.columns((1, 10))

    with col1:
        cc = st.toggle("", key="cc", help="Not recommended for P2D model")
        thermal = st.toggle("", key="thermal")
        solid = st.toggle("", key="solid", value=True)

        st.text("")
        st.text("")
        st.text("")
        st.text("")
        st.text("")
        ramp = st.toggle("", key="ramp", value=True)

    with col2:
        st.write("Include Current Collector model")
        st.write("Include Thermal model")
        st.write("Include Solid Diffusion model")
        if solid:
            st.selectbox("Select Solid Diffusion model", ("full", "simple"))

        st.write("Use Ramp up")
        if ramp:
            cola, colb = st.columns((1, 3))
            cola.text("")
            cola.text("")
            cola.write("Number of ramp up steps: ")
            colb.number_input("", value=5)

    col3, col4 = st.columns((1, 4))

    col3.text("")
    col3.text("")

    col3.write("Time step duration: ")
    col4.number_input("", value=30)
