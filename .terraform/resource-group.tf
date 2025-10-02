resource "azurerm_resource_group" "staging" {
  name     = var.staging_rg_name
  location = var.location
}
