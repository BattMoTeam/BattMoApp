import sys
import os

##############################
# Set page directory to base level to allow for module import from different folder
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
##############################

from app_scripts import app_access

"""
Important links between tables:

- a template has template_parameters
- a parameter has parameters
- a parameter refers to a template_parameter (which contains its metadata)

- a category pertains to a tab
- a category has an assigned default template

- a model can have custom templates for each category; if not, default template is used
- a model has model_parameters

"""

if __name__ == "__main__":

    con, cur = app_access.get_sqlite_con_and_cur()

    cur.execute("DROP TABLE parameter")
    cur.execute("DROP TABLE parameter_set")
    cur.execute("DROP TABLE template_parameter")
    cur.execute("DROP TABLE model")
    cur.execute("DROP TABLE category")
    cur.execute("DROP TABLE material")
    cur.execute("DROP TABLE cell_type")
    cur.execute("DROP TABLE cell_design")

    ########################################################
    #       parameter
    #       name, parameter_set_id, template_parameter_id, value
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS parameter(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            display_name VARCHAR(40) NOT NULL DEFAULT " ",
            parameter_set_id INT NOT NULL,
            template_parameter_id INT NOT NULL,
            value VARCHAR(255) DEFAULT NULL
            
        )
    """
    )

    ########################################################
    #       parameter_set
    #       name, category_id
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS parameter_set(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            category_id INT DEFAULT NULL
            
        )
    """
    )

    ########################################################
    #       template_parameter
    #       name, template_id, context_type, context_type_iri, type, unit, unit_name, unit_iri, max_value, min_value, is_shown_to_user, description
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS template_parameter(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            display_name VARCHAR(255) DEFAULT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            type VARCHAR(40) DEFAULT NULL,
            unit VARCHAR(40) DEFAULT NULL,
            unit_name VARCHAR(40) DEFAULT NULL,
            unit_iri VARCHAR(40) DEFAULT NULL,
            max_value VARCHAR(255) DEFAULT NULL,
            min_value VARCHAR(255) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
            
        )
    """
    )

    ########################################################
    #       model
    #       name, description
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS model(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL DEFAULT " ",
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            is_shown_to_user BOOLEAN DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """
    )

    ########################################################
    #       category
    #       name, context_type, context_type_iri, emmo_relation, display_name, tab_id, default_template_id, description
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS category(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL DEFAULT " ",
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """
    )

    ########################################################
    #       material
    #       name, model_name, difficulty, display_name, context_type, context_type_iri, description
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS material(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL,
            category_id INT DEFAULT NULL,
            parameter_set_id INT DEFAULT NULL,
            default_parameter_set BOOLEAN DEFAULT NULL,
            is_shown_to_user BOOLEAN NOT NULL DEFAULT 1,
            reference_name VARCHAR(40) DEFAULT NULL,
            reference VARCHAR(40) DEFAULT NULL,
            reference_url VARCHAR(40) DEFAULT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """
    )

    ########################################################
    #       cell_type
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS cell_type(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL,
            category_id INT DEFAULT NULL,
            parameter_set_id INT DEFAULT NULL,
            default_parameter_set BOOLEAN DEFAULT NULL,
            is_shown_to_user BOOLEAN NOT NULL DEFAULT 1,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """
    )

    ########################################################
    #       cell_design
    ########################################################
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS cell_design(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            display_name VARCHAR(40) NOT NULL,
            cell_type_id INT DEFAULT NULL,
            category_id INT DEFAULT NULL,
            parameter_set_id INT DEFAULT NULL,
            default_parameter_set BOOLEAN DEFAULT NULL,
            is_shown_to_user BOOLEAN NOT NULL DEFAULT 1,
            reference_name VARCHAR(40) DEFAULT NULL,
            reference VARCHAR(40) DEFAULT NULL,
            reference_url VARCHAR(40) DEFAULT NULL,
            context_type VARCHAR(40) DEFAULT NULL,
            context_type_iri VARCHAR(40) DEFAULT NULL,
            description VARCHAR(255) NULL DEFAULT ""
        )
    """
    )

    data = cur.execute("""SELECT * FROM cell_design""")
    print(data.description)
