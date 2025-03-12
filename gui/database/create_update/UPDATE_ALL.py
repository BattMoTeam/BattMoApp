from update_specific_tables.update_template_parameters import UpdateTemplateParameters
from update_specific_tables.update_models import UpdateModels
from update_specific_tables.update_materials import UpdateMaterials
from update_specific_tables.update_categories import UpdateCategories
from update_specific_tables.update_all_parameter_sets import UpdateParameterSets
from update_specific_tables.update_cell_types import UpdateCellTypes
from update_specific_tables.update_cells import UpdateCells
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import db_handler
from app_scripts import app_access


"""
Update all db tables, according to the information stored in the different json files.
Those files are located in the directory python/resources/db/resources
"""

#########################################
# RUN FILE TO UPDATE EVERYTHING
#########################################

if __name__ == "__main__":
    # IF NEEDED, uncomment following lines to reset table, in order to update template parameters' order

    # sql_template_parameter = db_handler.TemplateParameterHandler()
    # sql_template_parameter.drop_table(confirm=True)
    # os.system("db_model.py")

    # 1. Template parameters (independent)
    UpdateTemplateParameters().execute_script()

    # 2. Categories (independent)
    UpdateCategories().execute_script()

    # 3. Models (depends on categories)
    UpdateModels().execute_script()

    # 4. parameter sets (depends on categories, and template parameters)
    ## parameters
    UpdateParameterSets().execute_script()

    # 5. Materials (depends on categories and parameter sets)
    UpdateMaterials().execute_script()

    # 6. cell_types (depends on categories and parameter sets)
    UpdateCellTypes().execute_script()

    # 7. cell_designs (depends on categories and parameter sets)
    UpdateCells().execute_script()


# Uncomment to see data in material table:

con, cur = app_access.get_sqlite_con_and_cur()
data = cur.execute("""SELECT * FROM cell""")
# Fetch all rows from the result
data = cur.fetchall()

# Check if there are columns to describe
if cur.description:
    # Print the column information
    print("Column names:", [col[0] for col in cur.description])

else:
    print("No columns to describe (empty result set)")

# Print the retrieved data
for row in data:
    print(row)

# Don't forget to close the cursor and connection when done
cur.close()
con.close()
