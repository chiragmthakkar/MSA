#!/usr/bin/env python
# coding: utf-8


import json
from flask import Flask
import os
import requests
from flask import render_template, url_for, jsonify, request
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
import sys

url = 'https://text-analysis-msa.cognitiveservices.azure.com/'
key1 = '2752415371234271945b3c6a6ae9957e'

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze-sdk', methods=['POST'])
def analyze_text_sdk():

    if request.method == 'POST':
        try:
            endpoint = url
            key = key1

            text = request.get_json()
            text = text['text']

            data = [text]

            credentials = AzureKeyCredential(key)
            text_analytics_client = TextAnalyticsClient(endpoint=endpoint, credential=credentials)

            result = text_analytics_client.analyze_sentiment(documents=data)[0]
            
            result_dict = {
                'method' : 'SDK',
                'sentiment' : result.sentiment,
                'positive_score' : result.confidence_scores.positive,
                'positive_neutral' : result.confidence_scores.neutral,
                'positive_negative' : result.confidence_scores.negative,
                'sentences' : []
            }
            for index, sentence in enumerate(result.sentences):
                result_dict['sentences'].append({
                    'text' : sentence.text,
                    'sentiment' : sentence.sentiment,
                    'positive_score' : sentence.confidence_scores.positive,
                    'positive_neutral' : sentence.confidence_scores.neutral,
                    'positive_negative' : sentence.confidence_scores.negative,
                })
            return jsonify(result_dict)
        except:
            return jsonify({"error": 'Internal Server Error'}), 500