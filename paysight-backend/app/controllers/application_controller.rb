class ApplicationController < ActionController::API
  MAX_PER_PAGE = 100
  DEFAULT_PER_PAGE = 25

  rescue_from StandardError do |e|
    Rails.logger.error("[#{e.class}] #{e.message}\n#{e.backtrace&.first(10)&.join("\n")}")
    render_error('Internal server error', status: :internal_server_error)
  end

  rescue_from ActiveRecord::RecordNotFound do |e|
    render_error(e.message, status: :not_found)
  end

  rescue_from ActionController::ParameterMissing do |e|
    render_error(e.message, status: :bad_request)
  end

  private

  def render_resource(resource, key: nil, status: :ok, paginate: false)
    if paginate
      per_page = clamp_per_page
      records = resource.page(params[:page]).per(per_page)
      payload = { (key || :data) => records }
      render json: { success: true, data: payload, meta: pagination_meta(records, per_page) }, status: status
    else
      payload = key ? { key => resource } : resource
      render json: { success: true, data: payload }, status: status
    end
  end

  def render_error(message, status: :unprocessable_entity)
    render json: { success: false, error: message }, status: status
  end

  def render_validation_errors(errors, status: :unprocessable_entity)
    render json: { success: false, errors: errors }, status: status
  end

  def pagination_meta(records, per_page)
    {
      total_count: records.total_count,
      total_pages: records.total_pages,
      current_page: records.current_page,
      per_page: per_page
    }
  end

  def clamp_per_page
    per_page = params[:per_page].to_i
    per_page = DEFAULT_PER_PAGE if per_page <= 0
    [per_page, MAX_PER_PAGE].min
  end
end
