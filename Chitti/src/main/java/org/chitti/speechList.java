package org.chitti;

import java.util.*;

public class speechList {

    interface prefix{
        String customer = "cus";
        String subscription ="sub";
        String invoice = "inv";
    }
    public static Entity findKeyword(String speech){

        if(speech.contains(prefix.customer)){
            return Entity.CUSTOMER;
        }
        else if(speech.contains(prefix.subscription)){
            return Entity.SUBSCRIPTION;
        }
        else if(speech.contains(prefix.invoice)){
            return Entity.INVOICE;
        }
        else {
            return Entity.UNKNOWN;
        }

    }

    public static String findCustomerAction(List<String> list){

        System.out.println(list.toString());

        List<String> cusList = Arrays.asList("list","customers","customer","create","created","today");
        List<String> cusCount = Arrays.asList("how","many","customer","customers","created","create","today");

        Collection<String> similarOne = new HashSet<String>( list );
        Collection<String> similartwo = new HashSet<String>( list );

        similarOne.retainAll(cusList);
        similartwo.retainAll(cusCount);

        System.out.println(similarOne.size());
        System.out.println(similartwo.size());


        return similarOne.size() > similartwo.size() ? action.list_customer : action.customer_created_today;


    }

    public static String findSubscriptionAction(List<String> list){
        System.out.println(list.toString());

        List<String> cusList = Arrays.asList("list","subscriptions","subscription","create","created","today");
        List<String> cusCount = Arrays.asList("how","many","subscriptions","subscription","created","create","today");

        Collection<String> similarOne = new HashSet<String>( list );
        Collection<String> similartwo = new HashSet<String>( list );

        similarOne.retainAll(cusList);
        similartwo.retainAll(cusCount);

        System.out.println(similarOne.size());
        System.out.println(similartwo.size());


        return similarOne.size() > similartwo.size() ? action.list_subscription : action.subscription_created_today;


    }

    public static String findInvoiceAction(List<String> list){
        System.out.println(list.toString());

        List<String> invList = Arrays.asList("list","invoice","invoices","paid","by","today");
        List<String> invCount = Arrays.asList("how","many","invoice","invoices","paid","by","today");

        Collection<String> similarOne = new HashSet<String>( list );
        Collection<String> similartwo = new HashSet<String>( list );

        similarOne.retainAll(invList);
        similartwo.retainAll(invCount);

        System.out.println(similarOne.size());
        System.out.println(similartwo.size());


        return similarOne.size() > similartwo.size() ? action.list_inv_paid : action.invoice_paid_today;



    }


}
