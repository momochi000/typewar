module BackboneHelper
  def render_backbone_templates
    templates = get_all_backbone_templates
    render :partial => 'layouts/all_templates', :locals => {templates: templates}
  end

  private

  def get_all_backbone_templates
    Dir[File.join(%w(app views backbone_templates ** *.html.haml))]
  end
end
