resource "azurerm_kubernetes_cluster" "staging" {
  name                = var.staging_aks_name
  location            = azurerm_resource_group.staging.location
  resource_group_name = azurerm_resource_group.staging.name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = var.node_vm_size
  }

  identity { type = "SystemAssigned" }
}

resource "azurerm_role_assignment" "staging_acr_pull" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  principal_id                     = azurerm_kubernetes_cluster.staging.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true
}

output "staging_rg_name" {
  value       = azurerm_resource_group.staging.name
  description = "Staging Resource Group"
}

output "staging_aks_name" {
  value       = azurerm_kubernetes_cluster.staging.name
  description = "Staging AKS cluster name"
}
