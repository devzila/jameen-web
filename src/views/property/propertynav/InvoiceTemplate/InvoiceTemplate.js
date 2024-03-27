import React from 'react'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import FroalaEditorComponent from 'react-froala-wysiwyg'
import { CCard } from '@coreui/react'
import FroalaEditor from 'react-froala-wysiwyg'

export default function InvoiceTemplate() {
  let config = {
    documentReady: false,
    heightMin: 100,

    events: {
      contentChanged: function (e, editor) {
        console.log(editor)
      },
    },
  }

  return (
    <div>
      <CCard className="p-2 mt-2 rounded-1 border-0">
        Invoice Template
        <FroalaEditorComponent tag="textarea" config={config} />
      </CCard>
    </div>
  )
}
