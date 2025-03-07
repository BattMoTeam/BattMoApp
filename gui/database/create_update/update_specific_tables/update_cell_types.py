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


class UpdateCellTypes:

    def __init__(self):
        self.sql_cell_type = db_handler.CellTypeHandler()
        self.sql_category = db_handler.CategoryHandler()
        self.sql_parameter_set = db_handler.ParameterSetHandler()

    def get_resource_as_json(self):
        return app_access.get_json_from_path(app_access.get_path_to_cell_types())

    def update_material_from_json(self, resource_file):

        cell_types = resource_file.get("cell_types")
        assert cell_types is not None, "This input format is not handled"

        new_types = []
        updated_types = []

        # every item which is not updated will be deleted, so we don't keep useless items in db
        existing_ids_to_be_deleted = self.sql_cell_type.get_all_ids()

        for name in cell_types:
            details = cell_types.get(name)

            is_shown_to_user = details.get("is_shown_to_user")
            context_type = details.get("context_type")
            context_type_iri = details.get("context_type_iri")
            description = details.get("description")
            display_name = details.get("display_name")
            default_parameter_set = details.get("default_parameter_set")

            category = details.get("category")
            category_id = self.sql_category.get_id_from_name(category)

            parameter_set_id = self.sql_parameter_set.get_id_from_name(name)

            cell_type_id = self.sql_cell_type.get_id_from_name(name)
            if cell_type_id:  # existing type
                self.sql_cell_type.update_by_id(
                    id=cell_type_id,
                    columns_and_values={
                        "display_name": display_name,
                        "category_id": category_id,
                        "parameter_set_id": parameter_set_id,
                        "default_parameter_set": default_parameter_set,
                        "is_shown_to_user": is_shown_to_user,
                        "context_type": context_type,
                        "context_type_iri": context_type_iri,
                        "description": description,
                    },
                )
                updated_types.append(name)
                if existing_ids_to_be_deleted:
                    existing_ids_to_be_deleted.remove(cell_type_id)

            else:  # non-existing type, create it
                self.sql_cell_type.insert_value(
                    name=name,
                    display_name=display_name,
                    category_id=category_id,
                    parameter_set_id=parameter_set_id,
                    default_parameter_set=default_parameter_set,
                    is_shown_to_user=is_shown_to_user,
                    context_type=context_type,
                    context_type_iri=context_type_iri,
                    description=description,
                )
                new_types.append(name)

        # Delete unused types which remain in the sql table
        deleted_types = []
        if existing_ids_to_be_deleted:
            for id_to_delete in existing_ids_to_be_deleted:
                deleted_types.append(self.sql_cell_type.get_name_from_id(id_to_delete))
                self.sql_cell_type.delete_by_id(id_to_delete)

            print(
                "\n SQL table component is up to date according to the resource file materials.json"
            )
            if updated_types:
                print(" Updated materials : ", updated_types)
            if new_types:
                print(" New materials: ", new_types)
            if deleted_types:
                print(" Deleted materials: ", deleted_types)

    def execute_script(self):
        return self.update_material_from_json(self.get_resource_as_json())


if __name__ == "__main__":
    UpdateCellTypes().execute_script()
