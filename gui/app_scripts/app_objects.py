#############################
# app_objects all the category and parameter objects corresponding to the different parameter types existing in db.
# handled parameter_types : {'str', 'bool', 'int', 'float', 'function'}
#
# When running app.py,
# the db_handler ParameterHandler checks if this list of handled parameters covers all the existing types
#############################
from math import ceil
import numpy as np
import os
import sys
import streamlit as st
import math

##############################
# Set page directory to base level to allow for module import from different folder
path_to_streamlit_module = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, path_to_streamlit_module)
##############################


class Materials(object):
    def __init__(
        self,
        id,
        name,
        display_name,
        context_type,
        context_type_iri,
        description,
        selected_value=None,
    ):

        self.id = id
        self.name = name
        self.display_name = display_name
        self.context_type = context_type
        self.context_type_iri = context_type_iri
        self.description = description

        self.options = {}
        self.default_value = None

        self.selected_value = selected_value

    def add_option(self, option_id, option_details):

        self.options[option_id] = option_details
        if self.default_value is None:
            self.default_value = option_details.display_name
        self.name = option_details.name

    def set_selected_value(self, value):
        self.selected_value = value

    def set_reference_url(self, reference_url):
        self.reference_url = reference_url


class TemplateParameter(object):
    """
    Base object containing basic information, common to all parameter types
    """

    def __init__(
        self,
        id,
        name,
        type,
        description,
        context_type=None,
        context_type_iri=None,
        display_name=None,
        selected_value=None,
    ):
        self.id = id
        self.name = name
        self.context_type = context_type
        self.context_type_iri = context_type_iri
        self.type = type
        self.description = description

        self.display_name = display_name
        self.set_display_name()

        self.options = {}
        self.default_value = None

        self.selected_value = selected_value

    def set_display_name(self):
        words = self.name.split("_")
        first_word = words[0]
        words[0] = first_word[0].upper() + first_word[1:]
        self.display_name = " ".join(words)

    def add_option(self, option_id, option_details):
        self.options[option_id] = option_details
        if self.default_value is None:
            self.default_value = option_details.value

    def set_selected_value(self, value):
        self.selected_value = value


class Material(Materials):
    def __init__(
        self,
        id,
        name,
        model_name,
        difficulty,
        material,
        default_template,
        display_name,
        emmo_relation,
        category_id,
        tab_id,
        default_template_id,
        context_type,
        context_type_iri,
        description,
    ):

        super().__init__(
            id=id,
            name=name,
            display_name=display_name,
            context_type=context_type,
            context_type_iri=context_type_iri,
            description=description,
        )


class NumericalParameter(TemplateParameter):
    def __init__(
        self,
        id,
        name,
        context_type,
        context_type_iri,
        type,
        description,
        min_value,
        max_value,
        unit,
        unit_name,
        unit_iri,
        display_name,
    ):

        self.min_value = float(min_value) if type == float.__name__ else int(min_value)
        self.max_value = float(max_value) if type == float.__name__ else int(max_value)
        self.unit = unit
        self.unit_name = unit_name
        self.unit_iri = unit_iri

        self.type = type

        super().__init__(
            id=id,
            name=name,
            context_type=context_type,
            context_type_iri=context_type_iri,
            type=self.type,
            description=description,
        )

    def set_reference_url(self, url):
        self.reference_url = url


class StrParameter(TemplateParameter):
    def __init__(
        self,
        id,
        name,
        context_type,
        context_type_iri,
        description,
        display_name,
        type=str.__name__,
    ):
        super().__init__(
            id=id,
            name=name,
            context_type=context_type,
            context_type_iri=context_type_iri,
            type=type,
            description=description,
        )

    def set_reference_url(self, url):
        self.reference_url = url


class BooleanParameter(TemplateParameter):
    def __init__(
        self,
        id,
        name,
        context_type,
        context_type_iri,
        description,
        display_name,
        type=bool.__name__,
    ):
        super().__init__(
            id=id,
            name=name,
            context_type=context_type,
            context_type_iri=context_type_iri,
            type=type,
            description=description,
        )


class FunctionParameter(TemplateParameter):
    def __init__(
        self,
        id,
        name,
        context_type,
        context_type_iri,
        type,
        description,
        unit,
        unit_name,
        unit_iri,
        display_name,
    ):

        self.unit = unit
        self.unit_name = unit_name
        self.unit_iri = unit_iri
        super().__init__(
            id=id,
            name=name,
            context_type=context_type,
            context_type_iri=context_type_iri,
            type=type,
            description=description,
            display_name=display_name,
        )

    def set_reference_url(self, url):
        self.reference_url = url

    #     self.set_display_name()

    # def set_display_name(self):
    #     if self.display_name is None:
    #         self.display_name = self.parameter_set


class Option_material(object):
    def __init__(
        self,
        parameter_set_name=None,
        parameter_set_display_name=None,
        parameters=None,
        parameter_ids=None,
        parameter_names=None,
        parameter_values=None,
        parameter_display_names=None,
        parameter_set_id=None,
        reference_url=None,
        context_type=None,
    ):
        self.display_name = parameter_set_display_name
        self.name = parameter_set_name
        self.reference_url = reference_url
        self.parameter_set_id = parameter_set_id
        self.parameters = parameters
        self.parameter_ids = parameter_ids
        self.parameter_names = parameter_names
        self.parameter_values = parameter_values
        self.parameter_display_names = parameter_display_names
        self.context_type = context_type


class Option_parameter(object):
    def __init__(
        self,
        formatted_value=None,
        parameter_set_id=None,
        parameter_display_name=None,
        parameter_name=None,
    ):
        self.value = formatted_value
        self.parameter_set_id = parameter_set_id
        self.parameter_display_name = parameter_display_name
        self.parameter_name = parameter_name
