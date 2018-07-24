package com.example.gyubeom.webapptest;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

public class MainActivity extends AppCompatActivity {

    WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);

        WebSettings webSet = web.getSettings();
        webSet.setJavaScriptEnabled(true);
        webSet.setDomStorageEnabled(true);
        webSet.setLoadWithOverviewMode(true);
        webSet.setUseWideViewPort(true);
        webSet.setBuiltInZoomControls(true);
        webSet.setDisplayZoomControls(false);
        webSet.setSupportZoom(true);
        webSet.setDefaultTextEncodingName("utf-8");
        webSet.setAllowUniversalAccessFromFileURLs(true);
        webSet.setJavaScriptCanOpenWindowsAutomatically(true);
        webSet.setSupportMultipleWindows(true);
        webSet.setSaveFormData(false);
        webSet.setSavePassword(false);
        webSet.setPluginState(WebSettings.PluginState.ON);

        webSet.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);

        web.addJavascriptInterface(new WebAppInterface(this),"Android");
        web.loadData("","text/html",null);

        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient());
//        web.loadUrl("file:////android_asset/index.html");
        web.loadUrl("https://vdesk.skbroadband.com");

        setContentView(web);
    }

    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else finish();
    }
}
