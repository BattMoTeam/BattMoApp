import os
from PIL import Image

import json
import pickle
import match_json
import streamlit as st
from app_parameter_model import *
from resources.db import db_helper, db_access
#from oct2py import Oct2Py
from copy import deepcopy
from uuid import uuid4
import sys
import requests
from flask_restful import Resource


        
if 'initi' not in st.session_state:
    st.session_state.initi = None


def reset_func(category_id, parameter_id, parameter):
    """
    Function needed for the selectboxes and number_inputs to work properly together.
    """
    value = parameter.options[st.session_state["select_{}_{}".format(category_id, parameter_id)]].value
    if isinstance(parameter, FunctionParameter):
        value = value.get("functionname")
    else:
        value = value
    st.session_state["input_{}_{}".format(category_id, parameter_id)] = value


def st_space(tab=None, space_width=1, space_number=1):
    """
    function meant to be a shortcut for adding space in streamlit. Not important.
    """
    space = ""
    for _ in range(space_width):
        space += "#"

    if tab:
        for _ in range(space_number):
            tab.markdown(space)
    else:
        for _ in range(space_number):
            st.markdown(space)


class SetHeading:
    """
    Only used in the "About" tab, nothing important here, opened for complete modification.
    """
    def __init__(self, logo):
        self.logo = logo

        self.title = "BattMo"
        self.subtitle = "Framework for continuum modelling of electrochemical devices."
        self.description = """
            BattMO simulates the Current-Voltage response of a battery, using on Physics-based
            models. For each tab below, load pre-defined parameters, modify them and submit a 
            simulation job.
        """

        self.website = "[BatteryModel.com](https://batterymodel.com/)"
        self.doi = "[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.6362783.svg)](https://doi.org/10.5281/zenodo.6362783)"
        self.github = "[![Repo](https://badgen.net/badge/icon/GitHub?icon=github&label)](https://github.com/BattMoTeam/BattMo)"

        # Set heading
        self.set_heading()

    def set_heading(self):
        self.set_title_and_logo()
        self.set_external_links()
        self.set_description()
        st_space()

    def set_title_and_logo(self):
        # Title and subtitle
        logo_col, title_col = st.columns([1, 5])
        logo_col.image(self.logo)
        title_col.title(self.title)
        st.text(self.subtitle)

    def set_external_links(self):
        # External links
        website_col, doi_col, github_col = st.columns([2, 3, 4])
        website_col.markdown(self.website)
        doi_col.markdown(self.doi)
        github_col.markdown(self.github)

    def set_description(self):
        # Description
        st.text(self.description)


class SetModelChoice:
    """
    Rendering of small section for model choice.
    For now (03/07/23) only P2D is used, so there's no "real" choice; could be removed if we stick to P2D only
    """
    def __init__(self):

        self.title = "Model"
        self.selected_model = None

        # Set Model choice
        self.set_model_choice()

    def set_model_choice(self):
        self.set_title()
        self.set_dropdown()
        st_space()

    def set_title(self):
        st.markdown("### " + self.title)

    def set_dropdown(self):
        models_as_dict = db_helper.get_models_as_dict()
        selected_model_id = st.selectbox(
            label="model choice",
            options=[model_id for model_id in models_as_dict],
            format_func=lambda x: models_as_dict.get(x),
            key="model_choice",
            label_visibility="collapsed"
        )
        self.selected_model = selected_model_id


# class GetTabData:
#     def __init__(self):

#     def get_sql_data(self):

#         #Get data relevent to chosen model

class SetBasisInputTabs:
    def __init__(self, images):

        self.image_dict = images

        #Initialize tabs
        self.title = "Parameters"
        self.set_title()
        self.set_basis_tabs()

    def set_title(self):
        st.markdown("### " + self.title)

    def set_basis_tabs(self):

        Electrodes, Electrolyte, Seperator, Protocol, BC = st.tabs(["Electrodes", "Electrolyte", "Seperator", "Protocol", "Boundary Conditions"])
        
        with Electrodes:
            image_collumn_electrodes,image2_collumn_electrodes, title_electrodes = st.columns([0.9,0.9,6])
            image_collumn_electrodes.image(self.image_dict['2'])
            image2_collumn_electrodes.image(self.image_dict['1'])
            with title_electrodes:
                st.text(" ")
                st.subheader("Electrodes")

            NE, PE = st.tabs(["Negative Electrode", "Positive Electrode"])
            with NE:
                parameter_NE_AM, selectbox_NE_AM, volumefraction_NE_AM = st.columns(3)
                parameter_NE_B, selectbox_NE_B, volumefraction_NE_B = st.columns(3)
                parameter_NE_Ad, selectbox_NE_Ad, volumefraction_NE_Ad = st.columns(3)

                with parameter_NE_AM:
                    st.markdown("###### "+ "Component")
                
                    st.markdown("Active Material")
                with selectbox_NE_AM:
                    st.markdown("###### "+ "Material")
                    NE_AM_choice = st.selectbox('Material', ('Graphite_Xu2015', 'Graphite_Safari2009', 'User Defined'), key = "NE_AM_choice",label_visibility="collapsed")
                with volumefraction_NE_AM:
                    st.markdown("###### "+ "Volume Fraction []")
                    volume_fraction_NE_AM = st.number_input(label = "Volume fraction",key = "volume fraction input NE AM", label_visibility="collapsed")
                if NE_AM_choice == 'User Defined':
                    NE_AM_exp = st.expander("Define active material parameters")
                    with NE_AM_exp:
                        st.write("parameter form")

                with parameter_NE_B:
                    st.markdown("Binder")
                with selectbox_NE_B:
                    NE_B_choice = st.selectbox('Material', ('PVDF', 'User Defined'), key = "NE_B_choice",label_visibility="collapsed")
                with volumefraction_NE_B:
                    volume_fraction_NE_B = st.number_input(label = "Volume fraction",key = "volume fraction input NE B", label_visibility="collapsed")
                if NE_B_choice == 'User Defined':
                    NE_B_exp = st.expander("Define binder parameters")
                    with NE_B_exp:
                        st.write("parameter form")
                with parameter_NE_Ad:
                    st.markdown("Additive")
                with selectbox_NE_Ad:
                    NE_Ad_choice = st.selectbox('Material', ('carbon_black', 'User Defined'), key = "NE_Ad_choice",label_visibility="collapsed")
                with volumefraction_NE_Ad:
                    volume_fraction_NE_Ad = st.number_input(label = "Volume fraction",key = "volume fraction input NE Ad", label_visibility="collapsed")
                if NE_Ad_choice == 'User Defined':
                    NE_Ad_exp = st.expander("Define additive parameters")
                    with NE_Ad_exp:
                        st.write("parameter form")

                    #Electrode_properties = st.tabs(["Electrode properties"])
                st.markdown("###### " + "Electrode properties")

                electrode_properties_NE, graphics_Electrodes_NE = st.columns([2,1])
                with graphics_Electrodes_NE:
                    st.markdown("Coating porosity []")
                with electrode_properties_NE:
                    parameter_Electrodes_porosity_NE, input_Electrodes_porosity_NE = st.columns(2)
                    with parameter_Electrodes_porosity_NE: 
                        st.markdown("Coating porosity []")
                    with input_Electrodes_porosity_NE: 
                        coating_porosity_NE = st.number_input(label = "Coating Porosity",key = "coating porosity input NE", label_visibility="collapsed")
                    parameter_Electrodes_mass_load_NE, input_Electrodes_mass_load_NE = st.columns(2)
                    with parameter_Electrodes_mass_load_NE: 
                        st.markdown("Mass loading []")
                    with input_Electrodes_mass_load_NE: 
                        mass_loading_NE = st.number_input(label = "Mass loading",key = "mass loading input NE", label_visibility="collapsed")
                    parameter_Electrodes_thickness_NE, input_Electrodes_thickness_NE = st.columns(2)
                    with parameter_Electrodes_thickness_NE: 
                        st.markdown("Coating thickness []")
                    with input_Electrodes_thickness_NE: 
                        coating_thickness_NE = st.number_input(label = "Coating thickness",key = "coating thickness input NE", label_visibility="collapsed")
            with PE:
                parameter_PE_AM, selectbox_PE_AM, volumefraction_PE_AM = st.columns(3)
                parameter_PE_B, selectbox_PE_B, volumefraction_PE_B = st.columns(3)
                parameter_PE_Ad, selectbox_PE_Ad, volumefraction_PE_Ad = st.columns(3)

                with parameter_PE_AM:
                    st.markdown("###### "+ "Component")
                    st.markdown("Active Material")
                with selectbox_PE_AM:
                    st.markdown("###### "+ "Material")
                    PE_AM_choice = st.selectbox('Material', ('Graphite_Xu2015', 'Graphite_Safari2009', 'User Defined'), key = "PE_AM_choice",label_visibility="collapsed")
                with volumefraction_PE_AM:
                    st.markdown("###### "+ "Volume Fraction []")
                    volume_fraction_PE_AM = st.number_input(label = "Volume fraction",key = "volume fraction input PE AM", label_visibility="collapsed")
                if PE_AM_choice == 'User Defined':
                    PE_AM_exp = st.expander("Define active material parameters")
                    with NE_AM_exp:
                        st.write("parameter form")

                with parameter_PE_B:
                    st.markdown("Binder")
                with selectbox_PE_B:
                    PE_B_choice = st.selectbox('Material', ('PVDF', 'User DefiPed'), key = "PE_B_choice",label_visibility="collapsed")
                with volumefraction_PE_B:
                    volume_fraction_PE_B = st.number_input(label = "Volume fraction",key = "volume fraction input PE B", label_visibility="collapsed")
                if PE_B_choice == 'User Defined':
                    PE_B_exp = st.expander("Define binder parameters")
                    with PE_B_exp:
                        st.write("parameter form")
                with parameter_PE_Ad:
                    st.markdown("Additive")
                with selectbox_PE_Ad:
                    PE_Ad_choice = st.selectbox('Material', ('carbon_black', 'User Defined'), key = "PE_Ad_choice",label_visibility="collapsed")
                with volumefraction_PE_Ad:
                    volume_fraction_PE_Ad = st.number_input(label = "Volume fraction",key = "volume fraction input PE Ad", label_visibility="collapsed")
                if PE_Ad_choice == 'User Defined':
                    PE_Ad_exp = st.expander("Define additive parameters")
                    with PE_Ad_exp:
                        st.write("parameter form")

                #Electrode_properties = st.tabs(["Electrode properties"])
                st.markdown("###### " + "Electrode properties")

                electrode_properties, graphics_Electrodes = st.columns([2,1])
                with graphics_Electrodes:
                    st.markdown("Coating porosity []")
                with electrode_properties:
                    parameter_Electrodes_porosity, input_Electrodes_porosity = st.columns(2)
                    with parameter_Electrodes_porosity: 
                        st.markdown("Coating porosity []")
                    with input_Electrodes_porosity: 
                        coating_porosity = st.number_input(label = "Coating Porosity",key = "coating porosity input", label_visibility="collapsed")
                    parameter_Electrodes_mass_load, input_Electrodes_mass_load = st.columns(2)
                    with parameter_Electrodes_mass_load: 
                        st.markdown("Mass loading []")
                    with input_Electrodes_mass_load: 
                        coating_porosity = st.number_input(label = "Mass loading",key = "mass loading input", label_visibility="collapsed")
                    parameter_Electrodes_thickness, input_Electrodes_thickness = st.columns(2)
                    with parameter_Electrodes_thickness: 
                        st.markdown("Coating thickness []")
                    with input_Electrodes_thickness: 
                        coating_porosity = st.number_input(label = "Coating thickness",key = "coating thickness input", label_visibility="collapsed")
            st.divider()
            
            n_to_p_parameter, empty, n_to_p_value_n, to, n_to_p_value_p, empty = st.columns([3,1.5,2.5,0.5,2.5,3])

            with n_to_p_parameter:
                st.markdown("N/P ratio")
            with n_to_p_value_n:
                n_to_p_n = st.number_input(label = "ntop_n", key = "ntop_n", value = 1.0, label_visibility="collapsed")
            with to:
                st.markdown(" / ")
            with n_to_p_value_p:
                n_to_p_p = st.number_input(label = "ntop_p", key = "ntop_p", value = 1.2, label_visibility="collapsed")

        st.divider()


            


    

class SetTabs:
    """
    - Rendering of almost all the Define Parameter tab
    - formatting parameters, json data creation

    Steps and hierarchy:

    - Model is chosen, cf class SetModelChoice (for now only P2D, but might be other choices later)
    -  corresponding templates are retrieved from database (db). cf templates in python/resources/db/resources/templates
        2 options for each category: either a custom template is defined, or if not the default template is used.
        Currently (03/07/23) only default templates are defined.

    - initialize tabs:
        create tab, check if there's more than one category
        if more than one, create subtabs (st.tab in a st.tab)

    - fill each category:
        retrieve raw parameters from db
        format them by creating python objects (easier to handle)
        create st.selectbox and number_input etc

        careful to optimize this section because it's rerun by streamlit at every click for every single parameter.
    """
    def __init__(self, images, model_id, context):
        # image dict stored for easier access
        self.image_dict = images

        # retrieve corresponding templates (not implemented yet)
        self.model_templates = db_helper.get_templates_by_id(model_id)

        # initialize formatter
        self.formatter = FormatParameters()

        self.has_quantitative_property = "hasQuantitativeProperty"

        # Create info box
        self.info = "Push on the 'Save Parameters' button at the bottom of the page to update the parameters for the simulation."
        self.set_info()

        # Initialize tabs
        self.title = "Parameters"
        self.set_title()
        self.all_tabs = st.tabs(db_helper.all_tab_display_names)

        # user_input is the dict containing all the json LD data
        self.user_input = {
            "@context": context,
            "battery:P2DModel": {
                "hasQuantitativeProperty": db_helper.get_model_parameters_as_dict(model_id)
            }
        }

        # Fill tabs
        self.set_tabs()

    def set_info(self):
        st.info(self.info)

    def set_title(self):
        st.markdown("### " + self.title)

    def set_tabs(self):
        for tab in self.all_tabs:
            tab_index = db_helper.get_tab_index_from_st_tab(tab)
            db_tab_id = db_helper.all_tab_id[tab_index]

            tab_context_type, tab_context_type_iri = db_helper.get_context_type_and_iri_by_id(db_tab_id)
            tab_parameters = {
                "label": db_helper.all_tab_display_names[tab_index],
                "@type": tab_context_type_iri
            }

            # logo and title
            self.set_logo_and_title(tab, tab_index)

            # get tab's categories
            categories = db_helper.get_categories_from_tab_id(db_tab_id)

            if len(categories) > 1:  # create one sub tab per category

                all_category_display_names = [a[5] for a in categories]
                all_sub_tabs = tab.tabs(all_category_display_names)
                i = 0

                for category in categories:
                    category_id, category_name, category_context_type, category_context_type_iri, emmo_relation, _, _, default_template_id, _ = category

                    category_parameters, emmo_relation = self.fill_category(
                        category_id=category_id,
                        category_name=category_name,
                        emmo_relation=emmo_relation,
                        default_template_id=default_template_id,
                        tab=all_sub_tabs[i]
                    )
                    i += 1

                    category_parameters["label"] = category_name
                    category_parameters["@type"] = category_context_type_iri

                    if emmo_relation is None:
                        tab_parameters[category_context_type] = category_parameters

                    else:
                        # emmo relations are used to define the json ld structure.
                        # This can be changed, nothing important here, it's just the json file rendering.
                        tab_parameters[emmo_relation] = [category_parameters]

            else:  # no sub tab is needed

                category_id, category_name, category_context_type, category_context_type_iri, emmo_relation, _, _, default_template_id, _ = categories[0]

                if category_name == "protocol":
                    # different way of filling parameters for protocol section, the idea is to choose the name of the
                    # protocol and then the parameters are filled. Could be done also for the Cell tab
                    category_parameters, _ = self.fill_category_protocol(
                        category_id=category_id,
                        category_name=category_name,
                        emmo_relation=emmo_relation,
                        default_template_id=default_template_id,
                        tab=tab
                    )

                else:
                    category_parameters, _ = self.fill_category(
                            category_id=category_id,
                            category_name=category_name,
                            emmo_relation=emmo_relation,
                            default_template_id=default_template_id,
                            tab=tab
                        )

                tab_parameters.update(category_parameters)

            # tab is fully defined, its parameters are saved in the user_input dict
            self.user_input[tab_context_type] = tab_parameters

    def set_logo_and_title(self, tab, tab_index):
        image_column, title_column = tab.columns([1, 5])
        image_column.image(self.image_dict[str(tab_index)])
        title_column.text(" ")
        title_column.subheader(db_helper.all_tab_display_names[tab_index])

    def fill_category(self, category_id, category_name, emmo_relation, default_template_id, tab):

        category_parameters = []
        # define streamlit columns
        select_box_col, input_col = tab.columns([4, 5])

        # get custom template if it exists or default one
        template_name = self.model_templates.get(category_name)
        template_id = db_helper.sql_template.get_id_from_name(template_name) if template_name else default_template_id

        # get corresponding template parameters from db
        raw_template_parameters = db_helper.get_template_parameters_from_template_id(template_id)

        # get parameter sets corresponding to category, then parameters from each set
        parameter_sets = db_helper.get_all_parameter_sets_by_category_id(category_id)

        parameter_sets_name_by_id = {}
        for id, name, _ in parameter_sets:
            parameter_sets_name_by_id[id] = name

        raw_parameters = []
        for parameter_set_id in parameter_sets_name_by_id:
            raw_parameters += db_helper.extract_parameters_by_parameter_set_id(parameter_set_id)

        # format all those parameters: use template parameters for metadata, and parameters for values.
        # all information is packed in a single python object
        # formatted_parameters is a dict containing those python objects
        formatted_parameters = self.formatter.format_parameters(raw_parameters, raw_template_parameters, parameter_sets_name_by_id)

        for parameter_id in formatted_parameters:
            parameter = formatted_parameters.get(parameter_id)
            if parameter.is_shown_to_user:

                # selectbox for left column (parameter sets)
                selected_value_id = select_box_col.selectbox(
                    label="[{}]({})".format(parameter.display_name, parameter.context_type_iri),
                    options=parameter.options,
                    key="select_{}_{}".format(category_id, parameter_id),
                    label_visibility="visible",
                    format_func=lambda x: parameter.options.get(x).display_name,
                    on_change=reset_func,
                    args=(category_id, parameter_id, parameter)
                )


                # number input / selectbox for right column, depending on the parameter type
                if isinstance(parameter, NumericalParameter):

                    user_input = input_col.number_input(
                        label="[{}]({})".format(parameter.unit, parameter.unit_iri),
                        value=parameter.options[selected_value_id].value,
                        min_value=parameter.min_value,
                        max_value=parameter.max_value,
                        key="input_{}_{}".format(category_id, parameter_id),
                        format=parameter.format,
                        step=parameter.increment,
                        label_visibility="visible"
                    )
                elif isinstance(parameter, FunctionParameter):
                    user_input = input_col.selectbox(
                        label=parameter.display_name,
                        options=[parameter.options.get(selected_value_id).value.get("functionname")],
                        key="input_{}_{}".format(category_id, parameter_id),
                        label_visibility="hidden",
                    )
                else:
                    user_input = input_col.selectbox(
                        label=parameter.display_name,
                        options=[parameter.options.get(selected_value_id).value],
                        key="input_{}_{}".format(category_id, parameter_id),
                        label_visibility="hidden",
                    )
                parameter.set_selected_value(user_input)

            formatted_value_dict = parameter.selected_value

            # add selected value to json dict, with correct formatting depending on type
            if isinstance(parameter, NumericalParameter):
                formatted_value_dict = {
                    "@type": "emmo:Numerical",
                    "hasNumericalData": parameter.selected_value
                }

            elif isinstance(parameter, StrParameter):
                formatted_value_dict = {
                    "@type": "emmo:String",
                    "hasStringData": parameter.selected_value
                }

            elif isinstance(parameter, BooleanParameter):
                formatted_value_dict = {
                    "@type": "emmo:Boolean",
                    "hasStringData": parameter.selected_value
                }

            elif isinstance(parameter, FunctionParameter):
                formatted_value_dict = {
                    "@type": "emmo:String",
                    "hasStringData": parameter.selected_value
                }

            parameter_details = {
                "label": parameter.name,
                "@type": parameter.context_type_iri if parameter.context_type_iri else "None",
                "value": formatted_value_dict
            }
            if isinstance(parameter, NumericalParameter):
                parameter_details["unit"] = "emmo:"+parameter.unit_name if parameter.unit_name else parameter.unit

            category_parameters.append(parameter_details)

        return {self.has_quantitative_property: category_parameters}, emmo_relation

    def fill_category_protocol(self, category_id, category_name, emmo_relation, default_template_id, tab):
        """
        same idea as fill category, just choosing a Protocol to set all params
        """

        category_parameters = []

        template_name = self.model_templates.get(category_name)
        template_id = db_helper.sql_template.get_id_from_name(template_name) if template_name else default_template_id

        raw_template_parameters = db_helper.get_template_parameters_from_template_id(template_id)

        parameter_sets = db_helper.get_all_parameter_sets_by_category_id(category_id)

        parameter_sets_name_by_id = {}
        for id, name, _ in parameter_sets:
            parameter_sets_name_by_id[id] = name

        selected_parameter_set_id = tab.selectbox(
            label="Protocol",
            options=parameter_sets_name_by_id,
            key="{}_{}".format(category_id, "parameter_sets"),
            label_visibility="visible",
            format_func=lambda x: parameter_sets_name_by_id.get(x)
        )

        raw_parameters = db_helper.extract_parameters_by_parameter_set_id(selected_parameter_set_id)

        formatted_parameters = self.formatter.format_parameters(raw_parameters, raw_template_parameters, parameter_sets_name_by_id)

        for parameter_id in formatted_parameters:
            parameter = formatted_parameters.get(parameter_id)
            if parameter.is_shown_to_user:
                selected_parameter_id = db_helper.get_parameter_id_from_template_parameter_and_parameter_set(
                    template_parameter_id=parameter.id,
                    parameter_set_id=selected_parameter_set_id
                )
                st_space(tab)
                name_col, input_col = tab.columns([1, 2])

                if isinstance(parameter, NumericalParameter):
                    name_col.write("[{}]({})".format(parameter.display_name, parameter.context_type_iri) + " (" + "[{}]({})".format(parameter.unit, parameter.unit_iri) + ")")

                    user_input = input_col.number_input(
                        label=parameter.name,
                        value=parameter.options.get(selected_parameter_id).value,
                        min_value=parameter.min_value,
                        max_value=parameter.max_value,
                        key="input_{}_{}".format(category_id, parameter_id),
                        format=parameter.format,
                        step=parameter.increment,
                        label_visibility="collapsed"
                    )
                else:
                    name_col.write(parameter.display_name)
                    user_input = input_col.selectbox(
                        label=parameter.display_name,
                        options=[parameter.options.get(selected_parameter_id).value],
                        key="input_{}_{}".format(category_id, parameter_id),
                        label_visibility="collapsed",
                    )
                parameter.set_selected_value(user_input)

            formatted_value_dict = parameter.selected_value

            if isinstance(parameter, NumericalParameter):
                formatted_value_dict = {
                    "@type": "emmo:Numerical",
                    "hasNumericalData": parameter.selected_value
                }

            elif isinstance(parameter, StrParameter):
                formatted_value_dict = {
                    "@type": "emmo:String",
                    "hasStringData": parameter.selected_value
                }

            elif isinstance(parameter, BooleanParameter):
                formatted_value_dict = {
                    "@type": "emmo:Boolean",
                    "hasStringData": parameter.selected_value
                }

            parameter_details = {
                "label": parameter.name,
                "@type": parameter.context_type_iri if parameter.context_type_iri else "None",
                "value": formatted_value_dict
            }
            if isinstance(parameter, NumericalParameter):
                parameter_details["unit"] = "emmo:"+parameter.unit_name if parameter.unit_name else parameter.unit

            category_parameters.append(parameter_details)

        return {self.has_quantitative_property: category_parameters}, emmo_relation


class JsonViewer:
    """
    Used in Run Simulation to be able to visualize the json contents.
    Might not be necessary, mostly used for debugging; TBD if you keep using it
    """
    def __init__(self, json_data, label="Json"):
        self.json_data = json_data
        self.label = label

        self.set_json_viewer()

    def set_json_viewer(self):
        viewer = st.expander(self.label)
        viewer.json(self.json_data)


class SaveParameters:
    """
    Rendering of Save Parameters section in Define Parameters tab

    Can be improved, to make it more obvious that it is needed to save before running simulation
    """
    def __init__(self, gui_parameters):
        self.header = "Save parameters"

        self.download_button_label = "Download parameters - Json LD format"

        self.gui_parameters = gui_parameters
        self.gui_file_data = json.dumps(gui_parameters, indent=2)
        self.gui_file_name = "gui_output_parameters.json"
        self.file_mime_type = "application/json"

        self.set_submit_button()

    def set_submit_button(self):
        # set header
        st.markdown("### " + self.header)

        # set download button
        st.download_button(
            label=self.download_button_label,
            data=self.gui_file_data,
            file_name=self.gui_file_name,
            mime=self.file_mime_type
        )

        st.button(
            label="Save Parameters",
            on_click=self.on_click_save_file
        )

    def on_click_save_file(self):
        path_to_battmo_input = db_access.get_path_to_battmo_input()
        # save parameters in json file
        with open(path_to_battmo_input, "w") as new_file:
            json.dump(
                self.gui_parameters,
                new_file,
                indent=3)

        # Format parameters from json-LD to needed format
        path_to_battmo_formatted_input = db_access.get_path_to_battmo_formatted_input()
        # save formatted parameters in json file
        with open(path_to_battmo_formatted_input, "w") as new_file:
            json.dump(
                match_json.get_batt_mo_dict_from_gui_dict(self.gui_parameters),
                new_file,
                indent=3
            )

        st.success("Your parameters are saved! Run the simulation to get your results.")



def octave_on_click(json_file):

    ##############################
    # Remember user changed values
    for k, v in st.session_state.items():
        st.session_state[k] = v
    ##############################

    ##############################
    # Set page directory to base level to allow for module import from different folder

    sys.path.insert(0, db_access.get_path_to_gui_dir())
    
    ##############################



    uuids = requests.get(url ='http://127.0.0.1:5000/run_simulation', data={'InputFolder': 'BattMoJulia', 
                                                                            'InputFile':'battmo_formatted_input.json',
                                                                            'JuliaModelFolder':'BattMoJulia',
                                                                            'JuliaModel': 'runP2DBattery.jl'}).json()




    with open(os.path.join("results", uuids), "rb") as pickle_result:
        result = pickle.load(pickle_result)

    with open(os.path.join(db_access.get_path_to_python_dir(), "battmo_result"), "wb") as new_pickle_file:
                pickle.dump(result, new_pickle_file)


    st.success("Simulation finished successfully! Check the results by clicking 'Plot latest results'.")



    # clear cache to get new data in hdf5 file (cf Plot_latest_results)
    st.cache_data.clear()



class RunSimulation:
    """
    Rendering of Run Simulation tab
    """
    def __init__(self):
        self.run_header = "Run Simulation"
        self.run_info = """ The BattMo toolbox used for running the simulations is Julia based. Julia is a compiled language and because of this, the first 
                            simulation will be slow, but next simulations will be very quick."""
        

        self.gui_button_label = "Save GUI output parameters"
        self.battmo_button_label = "Save BattMo input parameters"
        self.json_file = os.path.join(db_access.get_path_to_BattMoJulia_dir(),"battmo_formatted_input.json")
        
        # retrieve saved parameters from json file
        with open(db_access.get_path_to_battmo_input()) as json_gui_parameters:
            self.gui_parameters = json.load(json_gui_parameters)

        self.download_header = "Download parameters"
        self.download_label = "Json LD format"
        self.gui_file_data = json.dumps(self.gui_parameters, indent=2)
        self.gui_file_name = "json_ld_parameters.json"
        self.file_mime_type = "application/json"

        # retrieve saved formatted parameters from json file
        with open(db_access.get_path_to_battmo_formatted_input()) as json_formatted_gui_parameters:
            self.formatted_gui_parameters = json.load(json_formatted_gui_parameters)

        self.download_label_formatted_parameters = "BattMo format"
        self.formatted_parameters_file_data = json.dumps(self.formatted_gui_parameters, indent=2)
        self.formatted_parameters_file_name = "battmo_formatted_parameters.json"

        #self.push_battmo_folder = 'push!(LOAD_PATH, "BattMoJulia")'
        self.runP2DBattery_path = db_access.get_path_to_runp2dbattery()

        #self.set_init_button()        
        self.set_submit_button()


    def set_submit_button(self):
        # set Download header
        st.markdown("### " + self.download_header)

        # set download button
        st.download_button(
            label=self.download_label,
            data=self.gui_file_data,
            file_name=self.gui_file_name,
            mime=self.file_mime_type
        )

        st.download_button(
            label=self.download_label_formatted_parameters,
            data=self.formatted_parameters_file_data,
            file_name=self.formatted_parameters_file_name,
            mime=self.file_mime_type
        )


        # set RUN header
        st.markdown("### " + self.run_header)

        #st.info(self.run_info)

        # set RUN button
        st.button(
            label="RUN",
            on_click= octave_on_click,
            args = ( self.json_file, )
            
        )
      




class LoadImages:
    """
    Get images as python objects
    - logo is used for page_icon and in "About" section
    - image_dict stores images used in Define_parameters
    """
    def __init__(self, path_to_images):
        self.path_to_images = path_to_images
        self.current_path = os.path.dirname(os.path.abspath(__file__))

        self.image_dict = self.load_images()
        self.logo = self.get_logo()

    def get_logo(self):
        return Image.open(os.path.join(self.path_to_images, "battmo_logo.png"))

    def load_images(self):
        def join_path(path):
            return os.path.join(self.path_to_images, path)

        # images are resized for better rendering

        l, w = 80, 80

        def image_open(file_name):
            image = Image.open(join_path(file_name))
            return image.resize((l, w))

        """
        This dict has to be refactored, it needs at least:
        - images for every parameter category
        - proper naming
        - remove useless items
        """
        return {
            "0": image_open("cell_coin.png"),
            "9": image_open("cell_prismatic.png"),
            "4": image_open("plus.png"),
            "1": image_open("plus.png"),
            "2": image_open("minus.png"),
            "3": image_open("electrolyte.png"),
            "5": image_open("current.png"),
            "6": image_open("current.png"),
            "7": image_open("current.png"),
            "8": image_open("cell_cylindrical.png")
        }

