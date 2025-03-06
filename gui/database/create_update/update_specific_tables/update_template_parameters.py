import os
import sys

##############################
# Set page directory to base level to allow for module import from different folder
sys.path.insert(
    0,
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
)
##############################

from database import db_handler
from app_scripts import app_access


class UpdateTemplateParameters:

    def __init__(self):
        self.sql_template_parameter = db_handler.TemplateParameterHandler()

    def get_resource_as_json(self):
        return app_access.get_json_from_path(app_access.get_path_to_template_parameters())

    def update_model_from_json(self, resource_file):

        template_parameters = resource_file.get("template_parameters")
        assert template_parameters is not None, "This input format is not handled"

        new_types = []
        updated_types = []

        # every item which is not updated will be deleted, so we don't keep useless items in db
        existing_ids_to_be_deleted = self.sql_template_parameter.get_all_ids()

        for name in template_parameters:
            details = template_parameters.get(name)

            # Get column values
            display_name = details.get("display_name")
            context_type = details.get("context_type")
            context_type_iri = details.get("context_type_iri")
            type = details.get("type")
            unit = details.get("unit")
            unit_name = details.get("unit_name")
            unit_iri = details.get("unit_iri")
            max_value = details.get("max_value")
            min_value = details.get("min_value")
            description = details.get("description")

            model_id = self.sql_template_parameter.get_id_from_name(name)

            if model_id:  # existing type
                self.sql_template_parameter.update_by_id(
                    id=model_id,
                    columns_and_values={
                        "display_name": display_name,
                        "context_type": context_type,
                        "context_type_iri": context_type_iri,
                        "type": type,
                        "unit": unit,
                        "unit_name": unit_name,
                        "unit_iri": unit_iri,
                        "max_value": max_value,
                        "min_value": min_value,
                        "description": description,
                    },
                )
                updated_types.append(name)
                existing_ids_to_be_deleted.remove(model_id)

            else:  # non-existing type, create it
                model_id = self.sql_template_parameter.insert_value(
                    name=name,
                    display_name=display_name,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    type=type,
                    unit=unit,
                    unit_name=unit_name,
                    unit_iri=unit_iri,
                    max_value=max_value,
                    min_value=min_value,
                    description=description,
                )
                new_types.append(name)

            # self.create_or_update_parameters(model_id, parameters)

        # Delete unused models which remain in the sql table
        deleted_types = []
        if existing_ids_to_be_deleted:
            for id_to_delete in existing_ids_to_be_deleted:
                deleted_types.append(self.sql_template_parameter.get_name_from_id(id_to_delete))
                self.sql_template_parameter.delete_by_id(id_to_delete)
                # self.create_or_update_parameters(id_to_delete, {})  # trick to delete corresponding parameters

        print(
            "\n SQL tables model and model_parameters are up to date according to the resource file models.json"
        )
        if updated_types:
            print(" Updated models : ", updated_types)
        if new_types:
            print(" New models: ", new_types)
        if deleted_types:
            print(" Deleted models: ", deleted_types)

    def execute_script(self):
        return self.update_model_from_json(self.get_resource_as_json())


if __name__ == "__main__":
    UpdateTemplateParameters().execute_script()
