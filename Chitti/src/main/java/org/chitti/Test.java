package org.chitti;

import com.chargebee.Environment;
import com.chargebee.ListResult;
import com.chargebee.filters.enums.SortOrder;
import com.chargebee.models.Subscription;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

public class Test {
    public static void main(String[] args) {
        try {
            Environment.configure("aravindh-test","test_Eah8bC7Nh5BcuusFliIp5n6HK2y0JNDin");
            ZoneId z = ZoneId.systemDefault();
            long secondsSinceEpoch = ZonedDateTime.now( z ).toLocalDate().atStartOfDay( z ).toEpochSecond() ;
            Timestamp ts=new Timestamp(secondsSinceEpoch*1000l);
            ListResult result = Subscription.list().limit(100).sortByCreatedAt(SortOrder.DESC).createdAt().after(ts).request();

            System.out.println(result.jsonResponse().toString());
        }catch (Exception e){

        }
    }
}
