package org.chitti;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.chargebee.*;
import com.chargebee.filters.enums.SortOrder;

import com.chargebee.models.Customer;
import com.chargebee.models.Invoice;
import com.chargebee.models.Subscription;
import org.json.JSONObject;
import com.chargebee.Environment;



import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;

public class cbHandler implements RequestStreamHandler {


    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        String line = null;

        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))) {
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }
        }

        JSONObject input = new JSONObject(stringBuilder.toString());

        System.out.println(input.toString());

        //parse based on request

        String speech = input.getString("speech");

        Entity type = speechList.findKeyword(speech);

        List<String> list = Arrays.asList(speech.split(" "));

        String event = null;

        if (type.equals(Entity.CUSTOMER)){
            event = speechList.findCustomerAction(list);
        }
        else if(type.equals(Entity.SUBSCRIPTION)){
            event = speechList.findSubscriptionAction(list);
        }
        else if(type.equals(Entity.INVOICE)){
            event = speechList.findInvoiceAction(list);
        }
        else {

        }
        com.chargebee.org.json.JSONObject output = new com.chargebee.org.json.JSONObject();

        try {
            Environment.configure(cbConstants.siteName,cbConstants.apiKey);
            ListResult result = getRequest(type);
            if(action.list_customer.equals(event) || action.list_subscription.equals(event) || action.list_inv_paid.equals(event)){
                output = result.jsonResponse();
                output.put("type",type.toString().toLowerCase());
            }
            else if(action.customer_created_today.equals(event) || action.subscription_created_today.equals(event) || action.invoice_paid_today.equals(event)){
                output.put("type",type.toString().toLowerCase());
                output.put("count",result.size());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //System.out.println(output);



        InputStream stream = new ByteArrayInputStream(output.toString().getBytes(StandardCharsets.UTF_8));
        int letter;
        while((letter = stream.read()) != -1)
        {
            outputStream.write((char)letter);
        }


    }

    private static ListResult getRequest(Entity entity) throws Exception {
        ZoneId z = ZoneId.systemDefault();
        long secondsSinceEpoch = ZonedDateTime.now( z ).toLocalDate().atStartOfDay( z ).toEpochSecond() ;
        Timestamp ts=new Timestamp(secondsSinceEpoch* 1000L);
        System.out.println(ts);

        switch (entity) {
            case CUSTOMER:
                return Customer.list().limit(100).sortByCreatedAt(SortOrder.DESC).createdAt().after(ts).request();
            case SUBSCRIPTION:
                return Subscription.list().limit(100).sortByCreatedAt(SortOrder.DESC).createdAt().after(ts).request();
            case INVOICE:
                return Invoice.list().limit(100).sortByDate(SortOrder.DESC).status().in(Invoice.Status.PAID).paidAt().after(ts).request();
            default:
                return null;
        }
    }

    public static void main(String[] args) {
        System.out.println(Entity.CUSTOMER);
    }
    }
