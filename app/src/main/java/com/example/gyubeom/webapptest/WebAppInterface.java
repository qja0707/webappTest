package com.example.gyubeom.webapptest;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    Context mContext;

    WebAppInterface(Context c){
        mContext = c;
    }

    @JavascriptInterface
    public void showToast(String toast){
        Toast.makeText(mContext,toast,Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void printLog(){
        System.out.println("gyubeom");
    }
}
