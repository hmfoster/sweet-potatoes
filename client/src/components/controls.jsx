import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className="controls">
      <button>Complete</button>
      <button>Skip</button>
    </div>;
  }
});
