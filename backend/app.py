import os
from flask import Flask, jsonify, request
from sentiment_analysis_functions import get_api_key, run_analysis_web,get_analysis_types, read_html_file, read_pdf_file,read_txt_file, read_url
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app)

get_api_key()

@app.post("/fileUpload")
def handleFileUpload():
    file = request.files['file']
    analysisType = request.form['analysisType']
    file.save('./Data/' + file.filename)

    if(file.filename.endswith(".pdf")):
        text = read_pdf_file(file.filename)
    elif(file.filename.endswith(".txt")):
        text = read_txt_file(file.filename)
    elif(file.filename.endswith(".html")):
        text = read_html_file(file.filename)
    
    if(text == None):
        return jsonify("""{"title": "Error, bad input"}""")
    
    os.remove('./Data/' + file.filename)
    
    
    return jsonify(run_analysis_web(text, analysisType))
#     return jsonify({
#   "title": "A Constitutional Perspective on Modern Gun Control",
#   "classification": "Center",
#   "summary": "The article analyzes the constitutionality of modern gun control using various techniques for interpreting the Constitution. It discusses landmark Supreme Court cases, the historical context of the Second Amendment, modern gun control legislation, and the role of statistics and data in evaluating gun laws.",
#   "reasoning": "The article takes a balanced approach by examining historical context, legal precedents, and statistical evidence without explicitly leaning towards right or left-leaning political ideologies. It presents a comprehensive analysis of the constitutional aspects of gun control, making it a center-leaning piece."
# })

@app.post("/urlUpload")
def handleURLUpload():
    url = request.form['url']
    analysisType = request.form['analysisType']

    text = read_url(url)

    if(text == None):
        return jsonify("""{"title": "Error, bad url"}""")
    
    
    return jsonify(run_analysis_web(text, analysisType))

@app.get("/analysisOptions")
def handleAnalysisOptions():
    return jsonify(list(get_analysis_types().keys()))