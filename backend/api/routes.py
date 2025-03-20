from flask import Blueprint, jsonify, request, send_file, redirect, url_for
from services.triz.triz_service import (
    analyze_patent,
    get_all_analyses,
    get_analysis_by_id,
    update_analysis,
    delete_analysis,
    approve_analysis,
    get_patent_by_id,
    get_patent_citations,
    get_triz_principles,
    get_engineering_parameters,
    get_triz_matrix,
    get_all_patents,
    upload_patent,
    get_patent_file,
    get_analyses_for_patent,
    create_patent_with_url,
)
import os
import sys
import uuid
from werkzeug.utils import secure_filename

# Add parent directory to path to import automated_analysis
sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)


def register_routes(app):
    """Register API routes with the Flask app"""

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Health check endpoint"""
        return jsonify(
            {"status": "ok", "message": "Patent Analytics Hub API is running"}
        )

    @app.route("/api/patents", methods=["GET"])
    def get_patents():
        """Get list of available patents with optional filtering"""
        try:
            search_term = request.args.get("search", "")
            status_filter = request.args.getlist("status")
            sort_order = request.args.get("sort", "newest")

            patents = get_all_patents(search_term, status_filter, sort_order)

            return jsonify({"patents": patents, "count": len(patents)})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/patents", methods=["POST"])
    def upload_patent_route():
        """Upload a new patent file"""
        try:
            # Check if this is a JSON request with file URL
            if request.is_json:
                data = request.json
                metadata = {}
                file_url = data.get("pdf_file")
                file_name = data.get("pdf_file_name", "unknown.pdf")
                
                # Extract metadata fields
                for field in [
                    "title",
                    "abstract",
                    "assignee",
                    "inventors",
                    "patent_number",
                    "filing_date",
                    "publication_date",
                ]:
                    if field in data:
                        metadata[field] = data.get(field)
                
                # Handle inventors as a list
                if "inventors" in metadata and isinstance(metadata["inventors"], str):
                    metadata["inventors"] = [
                        inv.strip() for inv in metadata["inventors"].split(",")
                    ]
                
                # Create a patent with the file URL
                result = create_patent_with_url(file_url, file_name, metadata)
                return jsonify(result)
            
            # Legacy file upload handling
            elif "file" in request.files:
                file = request.files["file"]
                if file.filename == "":
                    return jsonify({"error": "No selected file"}), 400
                
                # Extract metadata from form
                metadata = {}
                for field in [
                    "title",
                    "abstract",
                    "assignee",
                    "inventors",
                    "patent_number",
                    "filing_date",
                    "publication_date",
                    "pdf_file",  # For direct URL passing
                ]:
                    if field in request.form:
                        metadata[field] = request.form.get(field)
                
                # Handle inventors as a list
                if "inventors" in metadata and isinstance(metadata["inventors"], str):
                    metadata["inventors"] = [
                        inv.strip() for inv in metadata["inventors"].split(",")
                    ]
                
                # Check if a PDF file URL was provided in the form
                if "pdf_file" in metadata and metadata["pdf_file"]:
                    # Create patent with the provided URL
                    result = create_patent_with_url(
                        metadata["pdf_file"], 
                        file.filename, 
                        metadata
                    )
                    return jsonify(result)
                else:
                    # Traditional file upload to server
                    file_data = file.read()
                    filename = secure_filename(file.filename)
                    result = upload_patent(file_data, filename, metadata)
                    return jsonify(result)
            else:
                return jsonify({"error": "No file or file URL provided"}), 400

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/patents/<patent_id>", methods=["GET"])
    def get_patent_detail(patent_id):
        """Get detailed information about a specific patent"""
        try:
            patent = get_patent_by_id(patent_id)
            if not patent:
                return jsonify({"error": "Patent not found"}), 404
            return jsonify(patent)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/patents/<patent_id>/file", methods=["GET"])
    def get_patent_file_route(patent_id):
        """Get the patent file for download"""
        try:
            file_path = get_patent_file(patent_id)
            if not file_path or not os.path.exists(file_path):
                return jsonify({"error": "Patent file not found"}), 404

            return send_file(file_path, as_attachment=True)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/patents/<patent_id>/analyses", methods=["GET"])
    def get_patent_analyses(patent_id):
        """Get all analyses for a specific patent"""
        try:
            analyses = get_analyses_for_patent(patent_id)
            return jsonify(analyses)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/patents/<patent_id>/citations", methods=["GET"])
    def get_patent_citations_route(patent_id):
        """Get citations for a specific patent"""
        try:
            citations = get_patent_citations(patent_id)
            return jsonify(citations)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyze-patent", methods=["POST"])
    def analyze_patent_route():
        """Analyze a patent using TRIZ methodology"""
        try:
            data = request.json
            patent_filename = data.get("patentFile")

            if not patent_filename:
                return jsonify({"error": "Patent filename is required"}), 400

            result = analyze_patent(patent_filename)
            return jsonify(result)

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyses", methods=["GET"])
    def get_analyses_route():
        """Get list of all analyses"""
        try:
            analyses = get_all_analyses()
            return jsonify(analyses)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyses/<analysis_id>", methods=["GET"])
    def get_analysis_detail(analysis_id):
        """Get detailed information about a specific analysis"""
        try:
            analysis = get_analysis_by_id(analysis_id)
            if not analysis:
                return jsonify({"error": "Analysis not found"}), 404
            return jsonify(analysis)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyses/<analysis_id>", methods=["PUT"])
    def update_analysis_route(analysis_id):
        """Update an existing analysis"""
        try:
            data = request.json
            result = update_analysis(analysis_id, data)
            if not result:
                return jsonify({"error": "Analysis not found"}), 404
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyses/<analysis_id>", methods=["DELETE"])
    def delete_analysis_route(analysis_id):
        """Delete an analysis"""
        try:
            success = delete_analysis(analysis_id)
            if success:
                return jsonify(
                    {"message": f"Analysis {analysis_id} deleted successfully"}
                )
            return jsonify({"error": "Failed to delete analysis"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/analyses/<analysis_id>/approve", methods=["POST"])
    def approve_analysis_route(analysis_id):
        """Approve an analysis"""
        try:
            result = approve_analysis(analysis_id)
            if not result:
                return jsonify({"error": "Analysis not found"}), 404
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/triz/principles", methods=["GET"])
    def get_triz_principles_route():
        """Get all TRIZ principles"""
        try:
            principles = get_triz_principles()
            return jsonify(principles)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/triz/parameters", methods=["GET"])
    def get_engineering_parameters_route():
        """Get all engineering parameters"""
        try:
            parameters = get_engineering_parameters()
            return jsonify(parameters)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/triz/matrix", methods=["GET"])
    def get_triz_matrix_route():
        """Get the TRIZ contradiction matrix"""
        try:
            matrix = get_triz_matrix()
            return jsonify(matrix)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
