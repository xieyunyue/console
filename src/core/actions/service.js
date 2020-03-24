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

import CreateServiceModal from 'projects/components/Modals/ServiceCreate'
import EditServiceModal from 'projects/components/Modals/ServiceSetting'
import EditGatewayModal from 'projects/components/Modals/ServiceGatewaySetting'
import { MODULE_KIND_MAP } from 'utils/constants'
import formPersist from 'utils/form.persist'

import WorkloadStore from 'stores/workload'

export default {
  'service.create': {
    on({ store, namespace, module, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]

      const workloadStore = new WorkloadStore()

      const modal = Modal.open({
        onOk: newObject => {
          let data = newObject

          if (!data) {
            return
          }

          if (kind) {
            if (Object.keys(newObject).length === 1 && newObject[kind]) {
              data = newObject[kind]
            }
          }

          store.create(data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}!` })
            success && success()
            formPersist.delete(`${module}_create_form`)
          })
        },
        namespace,
        modal: CreateServiceModal,
        workloadStore,
        store,
        ...props,
      })
    },
  },
  'service.edit': {
    on({ store, detail, ...props }) {
      const modal = Modal.open({
        onOk: newObject => {
          store.update(detail, newObject).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}!` })
          })
        },
        modal: EditServiceModal,
        detail: detail._originData,
        type: detail.type,
        store,
        ...props,
      })
    },
  },
  'service.gateway.edit': {
    on({ store, detail, ...props }) {
      const modal = Modal.open({
        onOk: newObject => {
          store.update(detail, newObject).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}!` })
          })
        },
        modal: EditGatewayModal,
        detail: detail._originData,
        store,
        ...props,
      })
    },
  },
}
