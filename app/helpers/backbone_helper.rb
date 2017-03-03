module BackboneHelper
  def render_backbone_templates
    templates = get_all_backbone_templates
    render :partial => 'layouts/all_templates', :locals => {templates: templates}
  end

  private

  def get_all_backbone_templates
    Dir[File.join(%w(app views handlebars_templates ** *.html*))]
  end
end
