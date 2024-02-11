############################################
# Get BattMo json input from json ld format
############################################

import numpy as np
from itertools import chain

def get_dict_from_has_quantitative(has_quantitative):
    """
    Simplifies json ld dict to increase readability in this file
    """
    new_dict = {}

    for item in has_quantitative:

        if type(item) != str:
            item_value_type = item.get("value", {}).get("@type", None)
            if item_value_type == "emmo:Numerical":
                new_dict[item.get("label")] = item.get("value", {}).get("hasNumericalData")
            elif item_value_type == "emmo:String":
                new_dict[item.get("label")] = item.get("value", {}).get("hasStringData")
            elif item_value_type == "emmo:Boolean":
                new_dict[item.get("label")] = bool(item.get("value", {}).get("hasStringData"))
            elif item_value_type is None:
                new_dict[item.get("label")] = item.get("value", {})
            else:
                assert False, "item not handled. {}".format(item)

    return new_dict


class Electrode(object):
    def __init__(self, am, binder, add, prop):

        self.am = get_dict_from_has_quantitative(am)
        self.binder = get_dict_from_has_quantitative(binder)
        self.add = get_dict_from_has_quantitative(add)
        #self.cc = get_dict_from_has_quantitative(cc)
        self.properties = get_dict_from_has_quantitative(prop)


class GuiDict(object):
    """
    Create a python object from the parameter dict for easier access and better readability
    """
    def __init__(self, gui_dict):
        self.model = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasModel").get("hasQuantitativeProperty"))
        self.cell = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasCell").get("hasBoundaryConditions").get("hasQuantitativeProperty"))
        self.raw_ele = gui_dict.get("MySimulationSetup").get("hasCell").get("hasElectrode")
        self.raw_ele_pe = self.raw_ele.get("hasPositiveElectrode")
        self.raw_ele_ne = self.raw_ele.get("hasNegativeElectrode")

        self.pe = Electrode(
            
            am=self.raw_ele_pe.get("hasActiveMaterial").get("hasQuantitativeProperty"),
            binder=self.raw_ele_pe.get("hasBinder").get("hasQuantitativeProperty"),
            add=self.raw_ele_pe.get("hasConductiveAdditive").get("hasQuantitativeProperty"),
            #cc=self.raw_ele_pe.get("hasConstituent").get("hasQuantitativeProperty"),
            prop=self.raw_ele_pe.get("hasObjectiveProperty").get("hasQuantitativeProperty"),
        )

        
        self.ne = Electrode(
            am=self.raw_ele_ne.get("hasActiveMaterial").get("hasQuantitativeProperty"),
            binder=self.raw_ele_ne.get("hasBinder").get("hasQuantitativeProperty"),
            add=self.raw_ele_ne.get("hasConductiveAdditive").get("hasQuantitativeProperty"),
            #cc=self.raw_ne.get("hasConstituent")[0].get("hasQuantitativeProperty"),
            prop=self.raw_ele_ne.get("hasObjectiveProperty").get("hasQuantitativeProperty"),
        )
        
        self.elyte_mat = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasCell").get("hasElectrolyte").get("hasQuantitativeProperty"))
        self.sep_mat = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasCell").get("hasSeparator").get("hasQuantitativeProperty"))
        self.sep_prop = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasCell").get("hasSeparator").get("hasQuantitativeProperty"))
        self.protocol = get_dict_from_has_quantitative(gui_dict.get("MySimulationSetup").get("hasCyclingProcess").get("hasQuantitativeProperty"))
        self.el = get_dict_from_has_quantitative(self.raw_ele.get("hasObjectiveProperty").get("hasQuantitativeProperty"))

def get_batt_mo_dict_from_gui_dict(gui_dict):
    json_ld = GuiDict(gui_dict)
    total_time = 2 / json_ld.protocol.get("c_rate") * json_ld.protocol.get("number_of_cycles") * 3600

    if "function" and "functionname" in json_ld.ne.am["open_circuit_potential"]:
        ne_am_function= "functionname"
    elif "function" in json_ld.ne.am["open_circuit_potential"]:
        ne_am_function = "function"
    elif "functionname" in json_ld.ne.am["open_circuit_potential"]:
        ne_am_function = "functionname"    

    if "function" and "functionname" in json_ld.pe.am["open_circuit_potential"]:
        pe_am_function= "functionname"
    elif "function" in json_ld.pe.am["open_circuit_potential"]:
        pe_am_function = "function"
    elif "functionname" in json_ld.pe.am["open_circuit_potential"]:
        pe_am_function = "functionname" 

    if "function" and "functionname" in json_ld.elyte_mat["conductivity"]:
        elyte_cond_function = "functionname"
    elif "function" in json_ld.elyte_mat["conductivity"]:
        elyte_cond_function = "function"
    elif "functionname" in json_ld.elyte_mat["conductivity"]:
        elyte_cond_function = "functionname" 

    if "function" and "functionname" in json_ld.elyte_mat["diffusion_coefficient"]:
        elyte_diff_function = "functionname"
    elif "function" in json_ld.elyte_mat["diffusion_coefficient"]:
        elyte_diff_function = "function"
    elif "functionname" in json_ld.elyte_mat["diffusion_coefficient"]:
        elyte_diff_function = "functionname" 

    return {
        "Geometry": {
            "case": "1D",
            "faceArea": json_ld.pe.properties.get("length") * json_ld.pe.properties.get("width")
        },
        "NegativeElectrode": {
            "Coating":{
                "thickness": json_ld.ne.properties.get("coating_thickness")*10**(-6),
                "N": json_ld.ne.am.get("number_of_discrete_cells_electrode"),
                "effectiveDensity": 1900,
                "bruggemanCoefficient": json_ld.ne.properties.get("bruggeman_coefficient"),
                "ActiveMaterial": {
                    "massFraction": json_ld.ne.am.get("mass_fraction"),
                    "density": json_ld.ne.am.get("density"),
                    "electronicConductivity": json_ld.ne.am.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.ne.am.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.ne.am.get("thermal_conductivity"),
                    "Interface": {
                        "saturationConcentration": json_ld.ne.am.get("maximum_concentration"),
                        "volumetricSurfaceArea": json_ld.ne.am.get("volumetric_surface_area"),
                        "density": json_ld.ne.am.get("density"),
                        "numberOfElectronsTransferred": json_ld.ne.am.get("number_of_electrons_transferred"),
                        "activationEnergyOfReaction": json_ld.ne.am.get("activation_energy_of_reaction"),
                        "reactionRateConstant": json_ld.ne.am.get("reaction_rate_constant"),
                        "guestStoichiometry100": json_ld.ne.am.get("maximum_lithium_stoichiometry"),
                        "guestStoichiometry0": json_ld.ne.am.get("minimum_lithium_stoichiometry"),
                        "chargeTransferCoefficient": 0.5,
                        "openCircuitPotential": {
                            "type": "function",
                            ne_am_function: json_ld.ne.am.get("open_circuit_potential")[ne_am_function],
                            "argumentlist": json_ld.ne.am.get("open_circuit_potential")["argument_list"]
                        },
                        
                    },
                    "diffusionModelType": json_ld.model.get("solid_diffusion_model_type"),
                    "SolidDiffusion": {
                        "activationEnergyOfDiffusion": json_ld.ne.am.get("activation_energy_of_diffusion"),
                        "referenceDiffusionCoefficient": json_ld.ne.am.get("diffusion_pre_exponential_factor"),
                        "particleRadius":json_ld.ne.am.get("particle_radius"),
                        "N": json_ld.ne.am.get("number_of_discrete_cells_particle_radius")
                    }
                },
                "Binder": {
                    "density": json_ld.ne.binder.get("density"),
                    "massFraction": json_ld.ne.binder.get("mass_fraction"),
                    "electronicConductivity": json_ld.ne.binder.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.ne.binder.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.ne.binder.get("thermal_conductivity")
                },
                "ConductingAdditive": {
                    "density": json_ld.ne.add.get("density"),
                    "massFraction": json_ld.ne.add.get("mass_fraction"),
                    "electronicConductivity": json_ld.ne.add.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.ne.add.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.ne.add.get("thermal_conductivity")
                }
                },
            "CurrentCollector": {
                "electronicConductivity":35500000.0,
                "N" : 5,
                "thickness" : 25e-6 
                # "thermalConductivity": json_ld.ne.cc.get("thermal_conductivity"),
                # "specificHeatCapacity": json_ld.ne.cc.get("specific_heat_capacity"),
                # "density": json_ld.ne.cc.get("density")
            }
        },
        "PositiveElectrode": {
            "Coating":{
                "thickness": json_ld.pe.properties.get("coating_thickness")*10**(-6),
                "N": json_ld.pe.am.get("number_of_discrete_cells_electrode"),
                "effectiveDensity": 1900,
                "bruggemanCoefficient": json_ld.pe.properties.get("bruggeman_coefficient"),
                "ActiveMaterial": {
                    "massFraction": json_ld.pe.am.get("mass_fraction"),
                    "density": json_ld.pe.am.get("density"),
                    "electronicConductivity": json_ld.pe.am.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.pe.am.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.pe.am.get("thermal_conductivity"),
                    "Interface": {
                        "saturationConcentration": json_ld.pe.am.get("maximum_concentration"),
                        "volumetricSurfaceArea": json_ld.pe.am.get("volumetric_surface_area"),
                        "density": json_ld.pe.am.get("density"),
                        "numberOfElectronsTransferred": json_ld.pe.am.get("number_of_electrons_transferred"),
                        "activationEnergyOfReaction": json_ld.pe.am.get("activation_energy_of_reaction"),
                        "reactionRateConstant": json_ld.pe.am.get("reaction_rate_constant"),
                        "guestStoichiometry100": json_ld.pe.am.get("maximum_lithium_stoichiometry"),
                        "guestStoichiometry0": json_ld.pe.am.get("minimum_lithium_stoichiometry"),
                        "chargeTransferCoefficient": 0.5,
                        "openCircuitPotential": {
                            "type": "function",
                            pe_am_function: json_ld.pe.am.get("open_circuit_potential")[pe_am_function],
                            "argumentlist": json_ld.pe.am.get("open_circuit_potential")["argument_list"]
                        },
                        
                    },
                    "diffusionModelType": json_ld.model.get("solid_diffusion_model_type"),
                    "SolidDiffusion": {
                        "activationEnergyOfDiffusion": json_ld.pe.am.get("activation_energy_of_diffusion"),
                        "referenceDiffusionCoefficient": json_ld.pe.am.get("diffusion_pre_exponential_factor"),
                        "particleRadius":json_ld.pe.am.get("particle_radius"),
                        "N": json_ld.pe.am.get("number_of_discrete_cells_particle_radius")
                    }
                },
                "Binder": {
                    "density": json_ld.pe.binder.get("density"),
                    "massFraction": json_ld.pe.binder.get("mass_fraction"),
                    "electronicConductivity": json_ld.pe.binder.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.pe.binder.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.pe.binder.get("thermal_conductivity")
                },
                "ConductingAdditive": {
                    "density": json_ld.pe.add.get("density"),
                    "massFraction": json_ld.pe.add.get("mass_fraction"),
                    "electronicConductivity": json_ld.pe.add.get("electronic_conductivity"),
                    "specificHeatCapacity": json_ld.pe.add.get("specific_heat_capacity"),
                    "thermalConductivity": json_ld.pe.add.get("thermal_conductivity")
                }
                },
            "CurrentCollector": {
                "electronicConductivity": 59600000.0,
                "N" : 5,
                "thickness" : 15e-6
                # "thermalConductivity": json_ld.pe.cc.get("thermal_conductivity"),
                # "specificHeatCapacity": json_ld.pe.cc.get("specific_heat_capacity"),
                # "density": json_ld.pe.cc.get("density")
            }
        },
        
        "Separator": {
            "thickness": json_ld.sep_prop.get("thickness")*10**(-6),
            "N": json_ld.sep_prop.get("number_of_discrete_cells_separator"),
            "porosity": json_ld.sep_prop.get("porosity"),
            "specificHeatCapacity": json_ld.sep_prop.get("specific_heat_capacity"),
            "thermalConductivity": json_ld.sep_prop.get("thermal_conductivity"),
            "density": json_ld.sep_prop.get("density"),
            "bruggemanCoefficient": json_ld.sep_prop.get("bruggeman_coefficient")
        },

            

        "Electrolyte": {
            "initialConcentration": 1000,
            "specificHeatCapacity": json_ld.elyte_mat.get("specific_heat_capacity"),
            "thermalConductivity": json_ld.elyte_mat.get("thermal_conductivity"),
            "density": json_ld.elyte_mat.get("density"),
            "ionicConductivity": {
                "type": "function",
                elyte_cond_function: json_ld.elyte_mat.get("conductivity")[elyte_cond_function],
                "argumentlist": json_ld.elyte_mat.get("conductivity")["argument_list"]
            },
            "diffusionCoefficient": {
                "type": "function",
                elyte_diff_function: json_ld.elyte_mat.get("diffusion_coefficient")[elyte_diff_function],
                "argumentlist": json_ld.elyte_mat.get("diffusion_coefficient")["argument_list"]
            },
            "compnames": [
                json_ld.elyte_mat.get("charge_carrier_name"),
                json_ld.elyte_mat.get("counter_ion_name")
            ],
            "species": {
                "chargeNumber": json_ld.elyte_mat.get("charge_carrier_charge_number"),
                "transferenceNumber": json_ld.elyte_mat.get("counter_ion_transference_number"),
                "nominalConcentration": 1000
            },
            "bruggemanCoefficient": json_ld.elyte_mat.get("bruggeman_coefficient")
        },
        "G": [],
        "SOC": json_ld.cell.get("initial_state_of_charge"),
        #"Ucut": json_ld.protocol.get("lower_cutoff_voltage"),
        "initT": json_ld.cell.get("initial_temperature"),
        #"use_thermal": json_ld.model.get("use_thermal"),
        "include_current_collectors": False,
        #"use_particle_diffusion": json_ld.model.get("use_solid_diffusion_model"),
        "Control": {
            "controlPolicy": json_ld.protocol.get("protocol_name"),
            "initialControl": json_ld.protocol.get("initial_step_type"),
            "CRate": json_ld.protocol.get("c_rate"),
            "lowerCutoffVoltage": json_ld.protocol.get("lower_cutoff_voltage"),
            "rampupTime" : 0.1,
            "upperCutoffVoltage": json_ld.protocol.get("upper_cutoff_voltage"),
            "dIdtLimit": json_ld.protocol.get("d_idt_limit"),
            "dEdtLimit": json_ld.protocol.get("d_edt_limit")
        },
        "ThermalModel": {
            "externalHeatTransferCoefficient": json_ld.cell.get("external_heat_transfer_coefficient"),
            "externalTemperature": json_ld.cell.get("ambient_temperature")
        },
        "TimeStepping": {
            "totalTime": total_time,
            "N": total_time / json_ld.model.get("time_step_duration"),
            "useRampup": json_ld.model.get("use_ramp_up"),
            "rampupTime": json_ld.model.get("ramp_up_time"),
            "numberOfTimeSteps": total_time / json_ld.model.get("time_step_duration"),
        },
        "Output": {
            "variables": [
                "energy"
            ]
        }
    }