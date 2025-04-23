package com.nutrium;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class StepTrackingService extends Service {
    private static final int SERVICE_NOTIFICATION_ID = 1;
    private static final String CHANNEL_ID = "StepTrackingChannel";
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        
        // Create a wake lock to prevent the CPU from sleeping
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "nutrium:StepTrackingWakeLock");
        wakeLock.acquire();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Create a notification channel for Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Tracking Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Background step tracking");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        // Create the notification
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Tracking Active")
                .setContentText("Your steps are being counted in the background")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .build();

        // Start as a foreground service with the notification
        startForeground(SERVICE_NOTIFICATION_ID, notification);

        // Start the headless JS task
        Intent headlessJsIntent = new Intent(getApplicationContext(), StepTrackingHeadlessTask.class);
        getApplicationContext().startService(headlessJsIntent);
        
        // Keep the service running
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    // Headless JS task class
    public static class StepTrackingHeadlessTask extends HeadlessJsTaskService {
        @Nullable
        @Override
        protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
            return new HeadlessJsTaskConfig(
                    "BackgroundStepTrackingService",
                    Arguments.createMap(),
                    0, // No timeout
                    true // Allow running while app is in foreground
            );
        }
    }
}