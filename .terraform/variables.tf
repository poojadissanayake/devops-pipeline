variable "location" {
  description = "Azure region"
  type        = string
  default     = "australiaeast"
}

variable "staging_rg_name" {
  description = "Resource Group for staging"
  type        = string
}

variable "staging_aks_name" {
  description = "AKS cluster name"
  type        = string
}

variable "dns_prefix" {
  description = "DNS prefix for AKS"
  type        = string
  default     = "staging-aks"
}

variable "kubernetes_version" {
  description = "AKS version (optional)"
  type        = string
  default     = null
}

variable "node_count" {
  description = "Node count"
  type        = number
  default     = 1
}

variable "node_vm_size" {
  description = "VM size"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "acr_name" {
  description = "ACR name"
  type        = string
}

variable "storage_account_name" {
  description = "Storage Account name"
  type        = string
}
