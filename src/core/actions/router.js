/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Modal, Notify } from 'components/Base'

import CreateModal from 'components/Modals/Create'
import EditRouteAnnotationsModal from 'projects/components/Modals/RouteAnnotationsEdit'
import EditRouteRulesModal from 'projects/components/Modals/RouteRulesEdit'
import { MODULE_KIND_MAP } from 'utils/constants'
import FORM_TEMPLATES from 'utils/form.templates'
import formPersist from 'utils/form.persist'
import FORM_STEPS from 'configs/steps/ingresses'

export default {
  'router.create': {
    on({ store, namespace, module, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      const modal = Modal.open({
        onOk: newObject => {
          if (!newObject) {
            return
          }

          store.create(newObject).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}!` })
            success && success()
            formPersist.delete(`${module}_create_form`)
          })
        },
        module,
        namespace,
        name: 'Route',
        formTemplate,
        steps: FORM_STEPS,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'router.rules.edit': {
    on({ store, detail, ...props }) {
      const modal = Modal.open({
        onOk: newObject => {
          store.update(detail, newObject).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}!` })
          })
        },
        modal: EditRouteRulesModal,
        detail: detail._originData,
        store,
        ...props,
      })
    },
  },
  'router.annotations.edit': {
    on({ store, detail, ...props }) {
      const modal = Modal.open({
        onOk: newObject => {
          store.update(detail, newObject).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}!` })
          })
        },
        modal: EditRouteAnnotationsModal,
        detail: detail._originData,
        store,
        ...props,
      })
    },
  },
}
