package com.conectar.notify

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class SubmitActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_submit)

        val pairAddress = intent.getStringExtra("pairAddress")
        val text = intent.getStringExtra("text")

        val tvInfo = findViewById<TextView>(R.id.tvInfo)
        val etCode = findViewById<EditText>(R.id.etCode)
        val btnSend = findViewById<Button>(R.id.btnSend)

        tvInfo.text = "Pair address: ${pairAddress ?: "(não fornecido)"}\nMensagem: ${text ?: ""}"

        // Prefill the code field with the text from the notification (if present)
        if (!text.isNullOrEmpty()) {
            // Keep only digits commonly used in pairing codes
            val digits = text.filter { it.isDigit() }
            if (digits.isNotEmpty()) {
                etCode.setText(digits)
            } else {
                // fallback to full text
                etCode.setText(text)
            }
        }

        btnSend.setOnClickListener {
            val code = etCode.text.toString().trim()
            if (code.isEmpty()) return@setOnClickListener
            sendCode(pairAddress ?: "", code)
            finish()
        }

        // Auto-send when the activity opens if a code is already present
        val autoSend = true // enabled by default as requested
        if (autoSend) {
            val presetCode = etCode.text.toString().trim()
            if (presetCode.isNotEmpty()) {
                // small delay to let the UI render briefly before sending
                CoroutineScope(Dispatchers.Main).launch {
                    delay(400) // 400ms
                    sendCode(pairAddress ?: "", presetCode)
                    finish()
                }
            }
        }
    }

    private fun sendCode(address: String, code: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val serverUrl = getString(R.string.server_url).trimEnd('/') + "/conectar/api/pair-submit"
                val jsonAddress = address.replace("\\"", "\\\\\"")
                val jsonCode = code.replace("\\"", "\\\\\"")
                val body = "{\"address\":\"$jsonAddress\",\"code\":\"$jsonCode\"}"
                val url = URL(serverUrl)
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true
                val out = OutputStreamWriter(conn.outputStream)
                out.write(body)
                out.close()
                val respCode = conn.responseCode
                // ignore response body for simplicity; optionally log or notify
            } catch (e: Exception) {
                // ignore or log
            }
        }
    }
}
