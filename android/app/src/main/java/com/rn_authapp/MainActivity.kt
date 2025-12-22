package com.rn_authapp

import android.content.Intent
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.graphics.Color

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RN_authApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
     createNotificationChannel()
  }

  private fun createNotificationChannel() {
    // Only required for Android 8.0 (API 26) and above
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

      // Register the channel with the system
      val notificationManager: NotificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
     
      // val channelId = "default_channel_id" // 👈 CRITICAL: MUST match the channel ID used in your Firebase message payload
      // val channelName = "App Notifications" // User-visible name
      // val importance = NotificationManager.IMPORTANCE_HIGH // Sets the notification priority

      val defaultChannel = NotificationChannel(
        "default_channel_id",
        "Default Channel",
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply { 
        description = "Default channel for app notifications received via Firebase."
        setShowBadge(true)
        enableVibration(true)
        enableLights(true)
        lightColor = Color.BLUE // Optional
       }

      notificationManager.createNotificationChannel(defaultChannel)
    }
  }

  override fun onNewIntent(intent: Intent) {                                                    
    super.onNewIntent(intent)                                                                    
    setIntent(intent)                                                                            
  }                           
}


