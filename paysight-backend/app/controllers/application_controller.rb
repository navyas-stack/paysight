class ApplicationController < ActionController::API
  MAX_PER_PAGE = 100
  DEFAULT_PER_PAGE = 25

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

      render json: { key => records, meta: pagination_meta(records, per_page) }, status: status
    elsif key
      render json: { key => resource }, status: status
    else
      render json: resource, status: status
    end
  end

  def render_error(message, status: :unprocessable_entity)
    render json: { error: message }, status: status
  end

  def render_validation_errors(errors, status: :unprocessable_entity)
    render json: { errors: errors }, status: status
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
    return DEFAULT_PER_PAGE if params[:per_page].blank?

    [[params[:per_page].to_i, 1].max, MAX_PER_PAGE].min
  end
end
