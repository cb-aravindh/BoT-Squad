package org.chitti;

public enum Entity {
    CUSTOMER, SUBSCRIPTION, INVOICE, UNKNOWN
}
interface action{
    String list_customer ="list_customer";
    String customer_created_today ="customer_created_today";
    String list_subscription ="list_subscription";
    String subscription_created_today ="subscription_created_today";
    String list_inv_paid= "list_inv_paid";
    String invoice_paid_today = "invoice_paid_today";
}
